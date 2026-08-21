import { Pool } from 'pg';

/**
 * Capa de datos de TOP DE CHILE.
 *
 * En desarrollo usa SQLite local (node:sqlite) para simplicidad;
 * en producción (Vercel) usa Postgres vía Supabase.
 *
 * Este módulo exporta un `db` con la misma forma de API que node:sqlite
 * pero ASÍNCRONA, para que `board.ts` sea agnóstico del motor:
 *
 *   await db.prepare(sql).all(...args)
 *   await db.prepare(sql).get(...args)
 *   await db.prepare(sql).run(...args)   -> { lastInsertRowid, changes }
 *   await db.exec(sql)
 *
 * El driver se elige con DATABASE_URL:
 *   - Sin DATABASE_URL  -> SQLite en ./data/trono.db
 *   - Con DATABASE_URL  -> Postgres (pg + pooler de Supabase)
 */

// ============ SQLite (dev local) ============

import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';

declare global {
  // eslint-disable-next-line no-var
  var __tronoDb: DatabaseSync | undefined;
}

function sqliteDb() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  const DB_PATH = process.env.DB_PATH || path.join(dataDir, 'trono.db');

  if (globalThis.__tronoDb) return globalThis.__tronoDb;
  const db = new DatabaseSync(DB_PATH);
  db.exec('PRAGMA journal_mode = WAL;');
  migrateSqlite(db);
  globalThis.__tronoDb = db;
  return db;
}

function migrateSqlite(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      active INTEGER DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS stores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      url TEXT NOT NULL,
      logo_url TEXT DEFAULT '',
      pitch TEXT DEFAULT '',
      category_id INTEGER NOT NULL REFERENCES categories(id),
      position INTEGER,
      current_price INTEGER,
      verified INTEGER DEFAULT 0,
      is_demo INTEGER DEFAULT 0,
      times_claimed INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      claimed_at TEXT
    );
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      store_id INTEGER NOT NULL REFERENCES stores(id),
      category_id INTEGER NOT NULL REFERENCES categories(id),
      amount_clp INTEGER NOT NULL,
      status TEXT DEFAULT 'pending',
      flow_order TEXT UNIQUE,
      prev_king_id INTEGER,
      payer_email TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')),
      paid_at TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_stores_cat_pos ON stores(category_id, position);
    CREATE INDEX IF NOT EXISTS idx_tx_status ON transactions(status);
    CREATE TABLE IF NOT EXISTS visits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_visits_created ON visits(created_at);
  `);
}

// ============ Postgres (producción / Supabase) ============

function pgPool() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // serverless: un solo cliente por lambda evita agotar sockets
    max: 1,
    // Forzar IPv4: el sandbox de build de Vercel no tiene ruta IPv6
    family: 4,
    ssl: process.env.PGSSL === 'false' ? false : { rejectUnauthorized: false },
  });
  return pool;
}

/** Convierte placeholders `?` de SQLite a `$1, $2, ...` de Postgres */
function toPg(sql: string): string {
  let i = 0;
  return sql.replace(/\?/g, () => '$' + ++i);
}

/** Normaliza valores de pg a lo que espera la lógica (fechas -> 'YYYY-MM-DD HH:MM:SS' UTC) */
function normalizeValue(v: unknown): unknown {
  if (v instanceof Date) return v.toISOString().slice(0, 19).replace('T', ' ');
  if (v && typeof v === 'object' && !Array.isArray(v)) {
    const out: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
      out[k] = normalizeValue(val);
    }
    return out;
  }
  return v;
}

// ============ Interfaz común ============

export type SqlValue = string | number | null;

export interface DbHandle {
  exec(sql: string): Promise<unknown>;
  prepare(sql: string): {
    all(...args: SqlValue[]): Promise<Record<string, unknown>[]>;
    get(...args: SqlValue[]): Promise<Record<string, unknown> | undefined>;
    run(...args: SqlValue[]): Promise<{ lastInsertRowid?: number; changes?: number }>;
  };
}

export function createDb(): DbHandle {
  if (process.env.DATABASE_URL) {
    const pool = pgPool();
    return {
      async exec(sql: string) {
        await pool.query(sql);
      },
      prepare(sql: string) {
        const pgSql = toPg(sql);
        return {
          async all(...args: SqlValue[]) {
            const r = await pool.query(pgSql, args as unknown[]);
            return r.rows.map(normalizeValue) as Record<string, unknown>[];
          },
          async get(...args: SqlValue[]) {
            const r = await pool.query(pgSql, args as unknown[]);
            return r.rows[0] ? (normalizeValue(r.rows[0]) as Record<string, unknown>) : undefined;
          },
          async run(...args: SqlValue[]) {
            if (/^\s*INSERT/i.test(pgSql)) {
              const r = await pool.query(pgSql + ' RETURNING id', args as unknown[]);
              return { lastInsertRowid: (r.rows[0]?.id as number) ?? 0, changes: r.rowCount ?? 0 };
            }
            const r = await pool.query(pgSql, args as unknown[]);
            return { changes: r.rowCount ?? 0 };
          },
        };
      },
    };
  }

  const db = sqliteDb();
  return {
    async exec(sql: string) {
      db.exec(sql);
    },
    prepare(sql: string) {
      return {
        async all(...args: SqlValue[]) {
          const st = db.prepare(sql);
          return st.all(...args) as Record<string, unknown>[];
        },
        async get(...args: SqlValue[]) {
          const st = db.prepare(sql);
          return st.get(...args) as Record<string, unknown> | undefined;
        },
        async run(...args: SqlValue[]) {
          const st = db.prepare(sql);
          const info = st.run(...args);
          return { lastInsertRowid: Number(info.lastInsertRowid), changes: Number(info.changes) };
        },
      };
    },
  };
}

export const db = createDb();

/** true si estamos conectados a Postgres (producción/Supabase), false si SQLite (dev) */
export const isPg = !!process.env.DATABASE_URL;
