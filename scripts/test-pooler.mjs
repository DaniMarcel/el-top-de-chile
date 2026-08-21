/** Prueba pooler de Supabase con ambos refs candidatos. */
import pg from 'pg';

const PWD = '0x121212FFF.%2F%2F.';
const refs = ['exogasxtkdhfampoueef', 'exogasxtkdhfampouuef'];

for (const ref of refs) {
  const url = `postgresql://postgres.${ref}:${PWD}@aws-0-sa-east-1.pooler.supabase.com:6543/postgres`;
  const pool = new pg.Pool({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
    family: 4,
    connectionTimeoutMillis: 10000,
  });
  try {
    const r = await pool.query('SELECT 1 AS ok, current_database() AS db');
    console.log('OK  | ref:', ref, '| db:', r.rows[0].db);
    console.log('URL:', url);
    await pool.end();
    process.exit(0);
  } catch (e) {
    console.log('FAIL| ref:', ref, '|', (e).message.slice(0, 120));
    await pool.end().catch(() => {});
  }
}
process.exit(1);
