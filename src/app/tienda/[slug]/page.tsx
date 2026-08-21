import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getStoreBySlug,
  getStoreHistory,
  getTopStore,
  requiredAmount,
} from '@/lib/board';
import { clp, fmtDateTime, timeAgo } from '@/lib/format';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  if (!store) return { title: 'Tienda no encontrada' };
  const title = store.position
    ? '#' + store.position + ' en ' + store.cat_name + ' - ' + store.name
    : store.name + ' - fuera del ranking';
  return {
    title,
    description:
      store.pitch ||
      store.name +
        ' en el ranking pagado TOP DE CHILE: ' +
        (store.position
          ? 'posición #' + store.position + ' en ' + store.cat_name + ', pagó ' + clp(store.current_price ?? 0) + ' por el trono.'
          : '¿recuperará su trono?'),
  };
}

export default async function StorePage({ params }: Props) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  if (!store) notFound();

  const [history, top, required] = await Promise.all([
    getStoreHistory(store.id),
    getTopStore(store.category_id),
    requiredAmount(store.category_id),
  ]);

  const isKing = store.position === 1;

  return (
    <div className="mx-auto max-w-3xl space-y-8 pt-10">
      <Link href={`/categoria/${store.cat_slug}`} className="text-sm font-bold text-neon hover:underline">
        ← Top {store.cat_name}
      </Link>

      <div
        className={'card overflow-hidden ' + (isKing ? 'border-gold/70 animate-pulsegold' : '')}
      >
        <div
          className={
            'px-6 py-3 text-xs font-black uppercase tracking-[0.25em] ' +
            (isKing ? 'bg-gold/15 text-gold' : 'bg-panel2 text-mut')
          }
        >
          {isKing ? '👑 REY ACTUAL de ' + store.cat_name : store.position ? '#' + store.position + ' en ' + store.cat_name : 'Fuera del ranking'}
        </div>
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-line bg-panel2 text-4xl">
            {store.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={store.logo_url} alt={store.name} className="h-16 w-16 rounded-xl object-contain" />
            ) : (
              store.name.charAt(0).toUpperCase()
            )}
          </div>
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-black">{store.name}</h1>
              {!!store.verified && (
                <span className="rounded-full border border-lime/40 bg-lime/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-lime">
                  ✓ verificada
                </span>
              )}
            </div>
            {store.pitch && <p className="text-mut">{store.pitch}</p>}
            <p className="text-sm text-mut">
              Pagó <b className="text-goldsoft">{clp(store.current_price ?? 0)}</b> por el trono
              {store.claimed_at && (
                <>
                  {' '}
                  <span className="text-mut/70">({timeAgo(store.claimed_at)})</span>
                </>
              )}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href={store.url}
                target="_blank"
                rel="noopener noreferrer nofollow sponsored"
                className="btn-ghost !py-2 text-xs"
              >
                Visitar tienda ↗
              </a>
              <Link
                href={`/reclamar?cat=${store.cat_slug}`}
                className="rounded-xl border border-gold/60 bg-gold/10 px-4 py-2 text-xs font-black uppercase tracking-wider text-gold hover:bg-gold/20 transition-colors"
              >
                ⚔️ Destronar a {store.name.split(' ')[0]} · {clp(required)}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-xs font-black uppercase tracking-[0.25em] text-mut">
          Historial de batallas
        </h2>
        {history.length === 0 ? (
          <p className="card px-6 py-8 text-center text-mut">
            Todavía sin coronaciones pagadas.
          </p>
        ) : (
          <div className="card divide-y divide-line overflow-hidden">
            {history.map((t) => (
              <div key={t.id} className="flex items-center justify-between gap-4 px-5 py-3">
                <p className="text-sm">
                  <span className="font-bold text-goldsoft">👑 {store.name}</span>{' '}
                  {t.prev_king_id ? 'tomó el trono' : 'se coronó rey'} por{' '}
                  <b>{clp(t.amount_clp)}</b>
                </p>
                <span className="shrink-0 text-xs text-mut">{fmtDateTime(t.paid_at!)}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="card border-line bg-panel2 p-6 text-center">
        <p className="text-mut">
          ¿Quieres que tu tienda aparezca acá arriba? El trono de {store.cat_name} hoy vale{' '}
          <b className="text-goldsoft">{clp(top?.current_price ?? 0)}</b>.
        </p>
        <Link href="/reclamar" className="btn-claim mt-4">
          👑 Reclama el Top 1
        </Link>
      </section>
    </div>
  );
}
