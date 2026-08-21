/** Prueba poolers de Supabase pasando el password COMO PARÁMETRO (no en la URL) */
import pg from 'pg';

const PWD = '0x121212FFF.//.'; // literal, sin codificar
const ref = 'exogasxtkdhfampoueef'; // confirmado por la project URL real

const conns = [
  {
    name: 'Session pooler (db.<ref>:5432)',
    cfg: { host: `db.${ref}.supabase.co`, port: 5432, database: 'postgres', user: `postgres.${ref}`, password: PWD },
  },
  {
    name: 'Transaction pooler (pooler:6543)',
    cfg: { host: 'aws-0-sa-east-1.pooler.supabase.com', port: 6543, database: 'postgres', user: `postgres.${ref}`, password: PWD },
  },
  {
    name: 'Direct con user postgres.<ref>',
    cfg: { host: `db.${ref}.supabase.co`, port: 5432, database: 'postgres', user: `postgres.${ref}`, password: PWD },
  },
];

for (const { name, cfg } of conns) {
  const pool = new pg.Pool({
    ...cfg,
    ssl: { rejectUnauthorized: false },
    family: 4,
    connectionTimeoutMillis: 8000,
  });
  try {
    const r = await pool.query('SELECT 1 AS ok, current_user AS u');
    console.log('OK  |', name, '| user:', r.rows[0].u);
    await pool.end();
    process.exit(0);
  } catch (e) {
    console.log('FAIL|', name, '|', (e).message.slice(0, 130));
    await pool.end().catch(() => {});
  }
}
process.exit(1);
