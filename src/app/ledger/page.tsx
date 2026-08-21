import type { Metadata } from 'next';
import Link from 'next/link';
import { getLedger, getStats } from '@/lib/board';
import { clp, fmtDateTime } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Ledger público',
  description:
    'Cada peso pagado en TOP DE CHILE, a la vista de todos. Transparencia total: esto es un ranking pagado y se nota.',
};

export default async function LedgerPage() {
  const [ledger, stats] = await Promise.all([getLedger(100), getStats()]);

  return (
    <div className="mx-auto max-w-4xl space-y-8 pt-10">
      <div className="space-y-3 text-center">
        <h1 className="text-4xl font-black sm:text-5xl">
          Ledger público 💰
        </h1>
        <p className="mx-auto max-w-xl text-mut">
          Cada peso pagado por el trono, a la vista de todos. Transparencia total: esto es un ranking
          pagado <b className="text-goldsoft">y se nota</b>.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1 text-sm font-bold">
          <span className="rounded-full border border-line px-4 py-1.5 text-mut">
            {stats.paidCount} coronaciones pagadas
          </span>
        </div>
      </div>

      {ledger.length === 0 ? (
        <p className="card px-6 py-12 text-center text-mut">
          Aún no hay batallas. La primera coronación queda grabada acá para siempre.
        </p>
      ) : (
        <div className="card divide-y divide-line overflow-hidden">
          {ledger.map((t) => (
            <div key={t.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5">
              <div className="min-w-0">
                <p className="text-sm">
                  <Link
                    href={`/tienda/${t.store_slug}`}
                    className="font-bold text-goldsoft hover:underline"
                  >
                    {t.store_name}
                  </Link>{' '}
                  {t.prev_name ? (
                    <>
                      destronó a <b className="text-mut">{t.prev_name}</b>
                    </>
                  ) : (
                    <span className="text-mut">se coronó rey</span>
                  )}{' '}
                  en <span className="font-semibold">{t.cat_name}</span>
                </p>
                <p className="text-xs text-mut">{fmtDateTime(t.paid_at!)}</p>
              </div>
              <p className="shrink-0 font-black text-gold">{clp(t.amount_clp)}</p>
            </div>
          ))}
        </div>
      )}

      <p className="text-center text-xs text-mut">
        ¿Quieres tu nombre acá arriba?{' '}
        <Link href="/reclamar" className="font-bold text-neon hover:underline">
          Toma el trono →
        </Link>
      </p>
    </div>
  );
}
