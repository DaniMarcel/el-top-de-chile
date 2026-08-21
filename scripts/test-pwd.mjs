/** Prueba Session pooler con TODAS las variantes de password */
import pg from 'pg';

const ref = 'exogasxtkdhfampoueef';
const host = `db.${ref}.supabase.co`;

// El password crudo es 0x121212FFF.//. — probemos distintas codificaciones
const passwords = [
  ['crudo', '0x121212FFF.//.'],
  ['%2F doble', '0x121212FFF.%2F%2F.'],
  ['%2F triple slash', '0x121212FFF.%2F%2F%2F'],
  ['%2F con punto final', '0x121212FFF.%2F%2F.%2F'],
  ['sin slash final', '0x121212FFF.%2F%2F'],
];

for (const [pname, pwd] of passwords) {
  const url = `postgresql://postgres.${ref}:${pwd}@${host}:5432/postgres`;
  const pool = new pg.Pool({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
    family: 4,
    connectionTimeoutMillis: 8000,
  });
  try {
    const r = await pool.query('SELECT 1 AS ok');
    console.log('OK  |', pname, '|', url);
    await pool.end();
    process.exit(0);
  } catch (e) {
    console.log('FAIL|', pname, '|', (e).message.slice(0, 100));
    await pool.end().catch(() => {});
  }
}
process.exit(1);
