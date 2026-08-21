/**
 * Test de conexión a Supabase: prueba variantes de la URL hasta encontrar la buena.
 * Uso: node scripts/test-pg.mts
 */
import pg from 'pg';

// Password que dio el usuario (puede terminar en "/" o no)
const PWD = '0x121212FFF.//.';
const PWD_SLASH = '0x121212FFF./';
const REF_IMG = 'exogasxtkdhfampouuef'; // tal como salía en la imagen del dashboard
const REF_USR = 'exogasxtkdhfampoueef'; // tal como la escribió el usuario

const variants: Array<[string, string]> = [
  ['direct ref-usuario, pwd exacto %2F%2F%2F', `postgresql://postgres:${encodeURIComponent(PWD)}@db.${REF_USR}.supabase.co:5432/postgres`],
  ['direct ref-usuario, pwd crudo', `postgresql://postgres:${PWD}@db.${REF_USR}.supabase.co:5432/postgres`],
  ['direct ref-usuario, pwd sin slash final', `postgresql://postgres:${encodeURIComponent('0x121212FFF.//')}@db.${REF_USR}.supabase.co:5432/postgres`],
  ['pooler ref-usuario, pwd exacto', `postgresql://postgres:${encodeURIComponent(PWD)}@aws-0-sa-east-1.pooler.supabase.com:6543/postgres`],
];

for (const [name, url] of variants) {
  const pool = new pg.Pool({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 8000,
  });
  try {
    const r = await pool.query('SELECT 1 AS ok, current_database() AS db, version() AS v');
    console.log('OK  |', name, '| db:', r.rows[0].db);
    await pool.end();
    process.exit(0);
  } catch (e) {
    console.log('FAIL|', name, '|', (e as Error).message.slice(0, 140).replace(/\n/g, ' '));
    await pool.end().catch(() => {});
  }
}
console.log('Ninguna variante funcionó');
process.exit(1);
