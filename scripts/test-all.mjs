/** Prueba TODAS las variantes de conexión Supabase (poolers + direct) con IPv4 forzado */
import pg from 'pg';

const PWD = '0x121212FFF.%2F%2F.';
const ref = 'exogasxtkdhfampoueef';

const urls = [
  // Session pooler (mismo host que direct pero user postgres.REF, puerto 5432)
  ['Session pooler 5432', `postgresql://postgres.${ref}:${PWD}@db.${ref}.supabase.co:5432/postgres`],
  // Transaction pooler
  ['Transaction pooler 6543', `postgresql://postgres.${ref}:${PWD}@aws-0-sa-east-1.pooler.supabase.com:6543/postgres`],
  // Session pooler pooler host
  ['Session pooler 5432 pooler', `postgresql://postgres.${ref}:${PWD}@aws-0-sa-east-1.pooler.supabase.com:5432/postgres`],
  // Direct con user postgres.REF (por si el user cambia)
  ['Direct user postgres.ref', `postgresql://postgres.${ref}:${PWD}@db.${ref}.supabase.co:5432/postgres`],
];

for (const [name, url] of urls) {
  const pool = new pg.Pool({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
    family: 4,
    connectionTimeoutMillis: 8000,
  });
  try {
    const r = await pool.query('SELECT 1 AS ok, current_database() AS db');
    console.log('OK  |', name, '| db:', r.rows[0].db);
    console.log('URL:', url);
    await pool.end();
    process.exit(0);
  } catch (e) {
    console.log('FAIL|', name, '|', (e).message.slice(0, 130));
    await pool.end().catch(() => {});
  }
}
process.exit(1);
