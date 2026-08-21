import { db, isPg, type SqlValue } from './db.ts';
import { config } from './config.ts';
import { clp, slugify } from './format.ts';
import { createFlowPayment } from './flow.ts';

// ============ Tipos ============

export interface CategoryRow {
  id: number;
  slug: string;
  name: string;
  description: string;
  active: number;
}

export interface StoreRow {
  id: number;
  slug: string;
  name: string;
  url: string;
  logo_url: string;
  pitch: string;
  category_id: number;
  position: number | null;
  current_price: number | null;
  verified: number;
  is_demo: number;
  times_claimed: number;
  created_at: string;
  claimed_at: string | null;
}

export interface TxRow {
  id: number;
  store_id: number;
  category_id: number;
  amount_clp: number;
  status: string;
  flow_order: string | null;
  prev_king_id: number | null;
  payer_email: string;
  created_at: string;
  paid_at: string | null;
}

export interface BoardRow extends StoreRow {
  cat_name: string;
  cat_slug: string;
}

export interface LedgerRow extends TxRow {
  store_name: string;
  store_slug: string;
  cat_name: string;
  prev_name: string | null;
}

// ============ Helpers ============

function rows<T>(r: Record<string, unknown>[]): T[] {
  return r.map((x) => ({ ...x })) as unknown as T[];
}
function row<T>(r: Record<string, unknown> | undefined): T | undefined {
  return r ? ({ ...r } as unknown as T) : undefined;
}

// ============ Consultas ============

export async function getCategories(): Promise<CategoryRow[]> {
  const r = await db.prepare('SELECT * FROM categories WHERE active = 1 ORDER BY id').all();
  return rows<CategoryRow>(r);
}

export async function getCategoryBySlug(slug: string): Promise<CategoryRow | undefined> {
  return row<CategoryRow>(await db.prepare('SELECT * FROM categories WHERE slug = ?').get(slug));
}

export async function getBoard(categoryId: number, limit?: number): Promise<BoardRow[]> {
  const sql = `
    SELECT s.*, c.name AS cat_name, c.slug AS cat_slug
    FROM stores s JOIN categories c ON c.id = s.category_id
    WHERE s.category_id = ? AND s.position IS NOT NULL
    ORDER BY s.position ASC
  `;
  const r = limit
    ? await db.prepare(sql + ' LIMIT ?').all(categoryId, limit)
    : await db.prepare(sql).all(categoryId);
  return rows<BoardRow>(r);
}

export async function getTopStore(categoryId: number): Promise<StoreRow | undefined> {
  return row<StoreRow>(
    await db.prepare('SELECT * FROM stores WHERE category_id = ? AND position = 1').get(categoryId)
  );
}

export async function getStoreBySlug(slug: string): Promise<BoardRow | undefined> {
  return row<BoardRow>(
    await db
      .prepare(
        `SELECT s.*, c.name AS cat_name, c.slug AS cat_slug
         FROM stores s JOIN categories c ON c.id = s.category_id
         WHERE s.slug = ?`
      )
      .get(slug)
  );
}

export async function getAllStores(): Promise<BoardRow[]> {
  const r = await db
    .prepare(
      `SELECT s.*, c.name AS cat_name, c.slug AS cat_slug
       FROM stores s JOIN categories c ON c.id = s.category_id
       ORDER BY s.id`
    )
    .all();
  return rows<BoardRow>(r);
}

export async function getStoreHistory(storeId: number): Promise<TxRow[]> {
  const r = await db
    .prepare(
      `SELECT * FROM transactions WHERE store_id = ? AND status = 'paid'
       ORDER BY paid_at DESC, id DESC LIMIT 20`
    )
    .all(storeId);
  return rows<TxRow>(r);
}

export async function getLedger(limit = 100): Promise<LedgerRow[]> {
  const r = await db
    .prepare(
      `SELECT t.*, s.name AS store_name, s.slug AS store_slug, c.name AS cat_name,
              ps.name AS prev_name
       FROM transactions t
       JOIN stores s ON s.id = t.store_id
       JOIN categories c ON c.id = t.category_id
       LEFT JOIN stores ps ON ps.id = t.prev_king_id
       WHERE t.status = 'paid'
       ORDER BY t.paid_at DESC, t.id DESC
       LIMIT ?`
    )
    .all(limit);
  return rows<LedgerRow>(r);
}

export async function getTxByOrder(orderId: string) {
  return row<{
    id: number;
    store_id: number;
    category_id: number;
    amount_clp: number;
    status: string;
    flow_order: string | null;
    prev_king_id: number | null;
    payer_email: string;
    created_at: string;
    paid_at: string | null;
    store_slug: string;
    cat_slug: string;
  }>(
    await db
      .prepare(
        `SELECT t.*, s.slug AS store_slug, c.slug AS cat_slug
         FROM transactions t
         JOIN stores s ON s.id = t.store_id
         JOIN categories c ON c.id = t.category_id
         WHERE t.flow_order = ?`
      )
      .get(orderId)
  );
}

export async function getStats() {
  const rev = row<{ total: number }>(
    await db
      .prepare(
        `SELECT COALESCE(SUM(amount_clp), 0) AS total FROM transactions WHERE status = 'paid'`
      )
      .get()
  );
  const paid = row<{ n: number }>(
    await db.prepare(`SELECT COUNT(*) AS n FROM transactions WHERE status = 'paid'`).get()
  );
  const pending = row<{ n: number }>(
    await db.prepare(`SELECT COUNT(*) AS n FROM transactions WHERE status = 'pending'`).get()
  );
  const stores = row<{ n: number }>(await db.prepare(`SELECT COUNT(*) AS n FROM stores`).get());
  const onBoard = row<{ n: number }>(
    await db.prepare(`SELECT COUNT(*) AS n FROM stores WHERE position IS NOT NULL`).get()
  );
  return {
    revenue: rev?.total ?? 0,
    paidCount: paid?.n ?? 0,
    pendingCount: pending?.n ?? 0,
    storeCount: stores?.n ?? 0,
    onBoardCount: onBoard?.n ?? 0,
  };
}

// ============ Visitas (contador en vivo) ============

/** Registra una visita (IP hasheada por privacidad). */
export async function recordVisit(ip: string): Promise<void> {
  const iso = new Date().toISOString();
  await db
    .prepare('INSERT INTO visits (ip, created_at) VALUES (?, ?)')
    .run(ip, iso);
}

export interface VisitStats {
  online: number;
  last24h: number;
}

/** Visitantes en línea (últimos 5 min) y únicos en las últimas 24 h. */
export async function getVisitStats(): Promise<VisitStats> {
  const fiveMin = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  const day = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const online = row<{ n: number }>(
    await db
      .prepare('SELECT COUNT(DISTINCT ip) AS n FROM visits WHERE created_at >= ?')
      .get(fiveMin)
  );
  const last24h = row<{ n: number }>(
    await db
      .prepare('SELECT COUNT(DISTINCT ip) AS n FROM visits WHERE created_at >= ?')
      .get(day)
  );
  return { online: online?.n ?? 0, last24h: last24h?.n ?? 0 };
}

// ============ El juego ============

export interface ClaimInput {
  name: string;
  email: string;
  url: string;
  logoUrl?: string;
  pitch?: string;
  categorySlug: string;
  amount: number;
}

/** Monto mínimo para tomar el trono de una categoría */
export async function requiredAmount(categoryId: number): Promise<number> {
  const top = await getTopStore(categoryId);
  const base = top?.current_price ?? config.startingPrice - config.minIncrement;
  return base + config.minIncrement;
}

export async function createClaim(input: ClaimInput) {
  const cat = await getCategoryBySlug(input.categorySlug);
  if (!cat) throw new Error('Esa categoría no existe.');

  const name = input.name.trim().slice(0, 60);
  if (!name) throw new Error('Ponle nombre a tu tienda.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) throw new Error('Email inválido.');
  let url = input.url.trim().slice(0, 200);
  if (!url) throw new Error('La URL de tu tienda es obligatoria.');
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;

  const required = await requiredAmount(cat.id);
  if (!Number.isInteger(input.amount) || input.amount < required) {
    throw new Error('El mínimo para tomar el trono es ' + clp(required) + '.');
  }
  const amount = Math.round(input.amount);

  // Re-clamo: si la misma URL ya está en la categoría, se actualiza la ficha
  let store = row<StoreRow>(
    await db
      .prepare('SELECT * FROM stores WHERE category_id = ? AND lower(url) = lower(?)')
      .get(cat.id, url)
  );
  let slug: string;
  if (store) {
    await db
      .prepare('UPDATE stores SET name = ?, url = ?, logo_url = ?, pitch = ? WHERE id = ?')
      .run(
        name,
        url,
        (input.logoUrl || '').trim().slice(0, 300),
        (input.pitch || '').trim().slice(0, 300),
        store.id
      );
    slug = store.slug;
  } else {
    const baseSlug = slugify(name);
    slug = baseSlug;
    let n = 2;
    while (await db.prepare('SELECT id FROM stores WHERE slug = ?').get(slug)) {
      slug = baseSlug + '-' + n;
      n++;
    }
    const info = await db
      .prepare(
        `INSERT INTO stores (slug, name, url, logo_url, pitch, category_id)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .run(
        slug,
        name,
        url,
        (input.logoUrl || '').trim().slice(0, 300),
        (input.pitch || '').trim().slice(0, 300),
        cat.id
      );
    store = row<StoreRow>(
      await db.prepare('SELECT * FROM stores WHERE id = ?').get(Number(info.lastInsertRowid))
    );
  }
  if (!store) throw new Error('Error creando la tienda.');

  const orderId =
    'TR-' +
    Date.now().toString(36).toUpperCase() +
    '-' +
    Math.random().toString(36).slice(2, 6).toUpperCase();
  const top = await getTopStore(cat.id);

  await db
    .prepare(
      `INSERT INTO transactions (store_id, category_id, amount_clp, status, flow_order, prev_king_id, payer_email)
       VALUES (?, ?, ?, 'pending', ?, ?, ?)`
    )
    .run(store.id, cat.id, amount, orderId, top?.id ?? null, input.email.trim().toLowerCase());

  const redirectUrl = await createFlowPayment({
    orderId,
    amount,
    subject: 'Top de Chile - ' + cat.name + ' - ' + name,
    email: input.email.trim(),
    urlReturn: config.siteUrl + '/?king=' + slug + '&cat=' + cat.slug,
    urlConfirmation: config.siteUrl + '/api/flow/webhook',
  });

  return { redirectUrl, storeSlug: slug, categorySlug: cat.slug, amount };
}

/**
 * Pago confirmado (webhook de Flow o checkout simulado):
 * la tienda toma el trono y todos los que estaban arriba bajan un puesto.
 * Idempotente: si la orden ya fue liquidada, no hace nada.
 */
export async function settlePaid(orderId: string): Promise<boolean> {
  const tx = await getTxByOrder(orderId);
  if (!tx || tx.status === 'paid') return false;

  const store = row<StoreRow>(
    await db.prepare('SELECT * FROM stores WHERE id = ?').get(tx.store_id)
  );
  if (!store) return false;

  await db.exec('BEGIN');
  try {
    const oldPos = store.position;
    if (oldPos !== null) {
      await db
        .prepare(
          `UPDATE stores SET position = position + 1
           WHERE category_id = ? AND position IS NOT NULL AND position < ?`
        )
        .run(tx.category_id, oldPos);
    } else {
      await db
        .prepare(
          `UPDATE stores SET position = position + 1
           WHERE category_id = ? AND position IS NOT NULL`
        )
        .run(tx.category_id);
    }
    await db
      .prepare(
        `UPDATE stores SET position = 1, current_price = ?, claimed_at = ${isPg ? 'NOW()' : "datetime('now')"},
         times_claimed = times_claimed + 1 WHERE id = ?`
      )
      .run(tx.amount_clp, store.id);
    await db
      .prepare(
        `UPDATE transactions SET status = 'paid', paid_at = ${isPg ? 'NOW()' : "datetime('now')"} WHERE id = ?`
      )
      .run(tx.id);
    await db.exec('COMMIT');
    return true;
  } catch (e) {
    await db.exec('ROLLBACK');
    throw e;
  }
}

// ============ Admin ============

export async function verifyStore(id: number, verified: boolean) {
  await db.prepare('UPDATE stores SET verified = ? WHERE id = ?').run(verified ? 1 : 0, id);
}

export async function deleteStore(id: number) {
  await db.prepare('DELETE FROM transactions WHERE store_id = ?').run(id);
  await db.prepare('DELETE FROM stores WHERE id = ?').run(id);
}

export async function purgeDemo() {
  const demos = rows<{ id: number }>(
    await db.prepare('SELECT id FROM stores WHERE is_demo = 1').all()
  );
  for (const d of demos) await deleteStore(d.id);
  return demos.length;
}

export async function seedDemoData() {
  const has = row<{ n: number }>(await db.prepare('SELECT COUNT(*) AS n FROM stores').get());
  if ((has?.n ?? 0) > 0) return 0;

  const cats: Array<[string, string, string]> = [
    ['suplementos', 'Suplementos y Nutrición', 'Proteínas, creatina y todo para el gym.'],
    ['ropa', 'Ropa y Moda', 'Marca chilena, moda local.'],
    ['sneakers', 'Sneakers', 'Zapatillas: las que se pelean en cada drop.'],
    ['tecnologia', 'Tecnología', 'Computación, consolas y gadgets.'],
    ['cafe', 'Café y Tostadores', 'Café de especialidad, tostado en Chile.'],
    ['belleza', 'Belleza', 'Cosmética, skincare y cuidado personal.'],
    ['mascotas', 'Mascotas', 'Todo para tus hijos de cuatro patas.'],
    ['gaming', 'Gaming', 'Periféricos, consolas y setups.'],
  ];
  for (const [slug, name, desc] of cats) {
    await db
      .prepare('INSERT INTO categories (slug, name, description) VALUES (?, ?, ?)')
      .run(slug, name, desc);
  }

  const catId = async (slug: string) =>
    (await getCategoryBySlug(slug))!.id;

  // Demo: tiendas de ejemplo marcadas is_demo=1 (se pueden purgar desde /admin)
  const demoStores: Array<{
    cat: string;
    name: string;
    url: string;
    pitch: string;
    pos: number;
    price: number;
    verified: number;
    daysAgo: number;
  }> = [
    { cat: 'suplementos', name: 'SportNutriShop', url: 'https://sportnutrishop.cl', pitch: 'Suplementos deportivos con envío a todo Chile.', pos: 1, price: 1500, verified: 1, daysAgo: 1 },
    { cat: 'suplementos', name: 'Pulse Nutrition', url: 'https://pulsenutrition.cl', pitch: 'Proteínas y creatina de calidad premium.', pos: 2, price: 1000, verified: 1, daysAgo: 2 },
    { cat: 'suplementos', name: 'MuscleZone CL', url: 'https://musclezone.cl', pitch: 'El gym de tu casa empieza acá.', pos: 3, price: 500, verified: 0, daysAgo: 3 },
    { cat: 'sneakers', name: 'Kickz Chile', url: 'https://kickzchile.cl', pitch: 'Sneakers 100% originales, drops semanales.', pos: 1, price: 1200, verified: 1, daysAgo: 1 },
    { cat: 'sneakers', name: 'SneakerHead CL', url: 'https://sneakerhead.cl', pitch: 'La comunidad sneaker más grande de Chile.', pos: 2, price: 700, verified: 0, daysAgo: 2 },
    { cat: 'cafe', name: 'Tostaduría Altura', url: 'https://tostaduriaaltura.cl', pitch: 'Café de especialidad tostado en los Andes.', pos: 1, price: 900, verified: 1, daysAgo: 1 },
  ];

  const storeIds: Record<string, number> = {};
  for (const s of demoStores) {
    const slug = slugify(s.name);
    const shiftSql = isPg
      ? 'NOW() - (? || \' days\')::interval'
      : "datetime('now', ?)";
    const shiftArg: SqlValue = isPg ? s.daysAgo : '-' + s.daysAgo + ' days';
    const info = await db
      .prepare(
        `INSERT INTO stores (slug, name, url, pitch, category_id, position, current_price, verified, is_demo, times_claimed, claimed_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 1, ${shiftSql})`
      )
      .run(slug, s.name, s.url, s.pitch, await catId(s.cat), s.pos, s.price, s.verified, shiftArg);
    storeIds[s.name] = Number(info.lastInsertRowid);
  }

  // Ledger demo: historial coherente
  const txs: Array<{ store: string; prev: string | null; amount: number; daysAgo: number }> = [
    { store: 'MuscleZone CL', prev: 'Pulse Nutrition', amount: 500, daysAgo: 3 },
    { store: 'Pulse Nutrition', prev: null, amount: 1000, daysAgo: 4 },
    { store: 'SneakerHead CL', prev: null, amount: 700, daysAgo: 2 },
    { store: 'Kickz Chile', prev: 'SneakerHead CL', amount: 1200, daysAgo: 1 },
    { store: 'Tostaduría Altura', prev: null, amount: 900, daysAgo: 1 },
    { store: 'SportNutriShop', prev: 'Pulse Nutrition', amount: 1500, daysAgo: 1 },
  ];
  for (const t of txs) {
    const store = row<StoreRow>(
      await db.prepare('SELECT * FROM stores WHERE id = ?').get(storeIds[t.store])
    )!;
    const prev = t.prev
      ? row<StoreRow>(await db.prepare('SELECT * FROM stores WHERE id = ?').get(storeIds[t.prev]))
      : undefined;
    const shiftSql = isPg
      ? 'NOW() - (? || \' days\')::interval'
      : "datetime('now', ?)";
    const shiftArg = (d: number): SqlValue => (isPg ? d : '-' + d + ' days');
    await db
      .prepare(
        `INSERT INTO transactions (store_id, category_id, amount_clp, status, flow_order, prev_king_id, created_at, paid_at)
         VALUES (?, ?, ?, 'paid', ?, ?, ${shiftSql}, ${shiftSql})`
      )
      .run(
        store.id,
        store.category_id,
        t.amount,
        'TX-DEMO-' + t.store,
        prev?.id ?? null,
        shiftArg(t.daysAgo),
        shiftArg(t.daysAgo)
      );
  }

  return 1;
}
