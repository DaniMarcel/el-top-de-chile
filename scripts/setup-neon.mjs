/**
 * Migra TOP DE CHILE a Neon: prueba conexión, aplica schema y siembra datos.
 * Uso: node scripts/setup-neon.mjs
 */
import { readFileSync } from 'node:fs';
import pg from 'pg';

const DATABASE_URL =
  'postgresql://neondb_owner:npg_9vGzJgsm2hwk@ep-sparkling-math-ac8r6pei.sa-east-1.aws.neon.tech/neondb?sslmode=require';

const pool = new pg.Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  family: 4,
  connectionTimeoutMillis: 15000,
});

try {
  // 0) Prueba de conexión
  const ping = await pool.query('SELECT 1 AS ok, current_database() AS db, version() AS v');
  console.log('OK conexión | db:', ping.rows[0].db);

  // 1) Schema (tablas + categorías)
  const schema = readFileSync(new URL('../supabase/schema.sql', import.meta.url), 'utf8');
  await pool.query(schema);
  console.log('OK schema + categorías');

  // 2) Tiendas demo
  const cat = async (slug) => (await pool.query('SELECT id FROM categories WHERE slug = $1', [slug])).rows[0].id;

  const stores = [
    ['sportnutrishop', 'SportNutriShop', 'https://sportnutrishop.cl', 'Suplementos deportivos con envío a todo Chile.', 'suplementos', 1, 1500, 1],
    ['pulse-nutrition', 'Pulse Nutrition', 'https://pulsenutrition.cl', 'Proteínas y creatina de calidad premium.', 'suplementos', 2, 1000, 1],
    ['musclezone-cl', 'MuscleZone CL', 'https://musclezone.cl', 'El gym de tu casa empieza acá.', 'suplementos', 3, 500, 0],
    ['kickz-chile', 'Kickz Chile', 'https://kickzchile.cl', 'Sneakers 100% originales, drops semanales.', 'sneakers', 1, 1200, 1],
    ['sneakerhead-cl', 'SneakerHead CL', 'https://sneakerhead.cl', 'La comunidad sneaker más grande de Chile.', 'sneakers', 2, 700, 0],
    ['tostaduria-altura', 'Tostaduría Altura', 'https://tostaduriaaltura.cl', 'Café de especialidad tostado en los Andes.', 'cafe', 1, 900, 1],
  ];
  for (const [slug, name, url, pitch, cslug, pos, price, ver] of stores) {
    await pool.query(
      `INSERT INTO stores (slug, name, url, pitch, category_id, position, current_price, verified, is_demo, times_claimed, claimed_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,1,1, now() - interval '1 day')
       ON CONFLICT (slug) DO NOTHING`,
      [slug, name, url, pitch, await cat(cslug), pos, price, ver]
    );
  }
  console.log('OK tiendas demo');

  // 3) Ledger demo
  const sid = async (slug) => (await pool.query('SELECT id FROM stores WHERE slug = $1', [slug])).rows[0].id;
  const txs = [
    ['sportnutrishop', 'pulse-nutrition', 1500],
    ['pulse-nutrition', null, 1000],
    ['kickz-chile', 'sneakerhead-cl', 1200],
  ];
  for (const [s, prev, amt] of txs) {
    const cid = (await pool.query('SELECT category_id FROM stores WHERE slug = $1', [s])).rows[0].category_id;
    await pool.query(
      `INSERT INTO transactions (store_id, category_id, amount_clp, status, flow_order, prev_king_id, created_at, paid_at)
       VALUES ($1,$2,$3,'paid',$4,$5, now() - interval '1 day', now() - interval '1 day')
       ON CONFLICT (flow_order) DO NOTHING`,
      [await sid(s), cid, amt, 'TX-DEMO-' + s, prev ? await sid(prev) : null]
    );
  }
  console.log('OK ledger demo');

  const c = await pool.query('SELECT COUNT(*) AS n FROM stores');
  const t = await pool.query('SELECT COUNT(*) AS n FROM transactions WHERE status=\'paid\'');
  console.log('RESUMEN:', c.rows[0].n, 'tiendas ·', t.rows[0].n, 'transacciones');
} catch (e) {
  console.error('ERROR:', (e).message.slice(0, 300));
  process.exitCode = 1;
} finally {
  await pool.end();
}
