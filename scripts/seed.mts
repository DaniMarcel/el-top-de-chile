/**
 * Seed de EL TRONO: categorías + tiendas demo + ledger de ejemplo.
 * Uso:
 *   npm run seed          → siembra solo si la DB está vacía
 *   npm run seed:reset    → borra todo y siembra de nuevo
 *
 * Funciona contra SQLite (dev) o Postgres (si DATABASE_URL está definida).
 * Para resetear en Postgres: npm run seed:reset (borra filas, no el schema).
 */
import { seedDemoData, getStats } from '../src/lib/board.ts';

const reset = process.argv.includes('--reset');

if (reset) {
  // En SQLite el schema se crea en migrate(); acá solo limpiamos filas.
  // En Postgres el schema se crea con neon/schema.sql.
  const { db } = await import('../src/lib/db.ts');
  await db.exec('DELETE FROM transactions; DELETE FROM stores; DELETE FROM categories;');
  console.log('🧹 DB limpiada');
}

const seeded = await seedDemoData();

if (seeded) {
  console.log('👑 EL TRONO sembrado: 8 categorías + tiendas demo + ledger de ejemplo');
} else {
  console.log('⚠️  La DB ya tiene datos — usa `npm run seed:reset` para re-sembrar');
}

const s = await getStats();
console.log(
  `📊 ${s.storeCount} tiendas · ${s.onBoardCount} en el ranking · ${s.paidCount} pagos`
);
