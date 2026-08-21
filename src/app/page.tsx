import Link from 'next/link';
import Board from '@/components/Board';
import VisitorCounter from '@/components/VisitorCounter';
import { getBoard, getCategories, getStats, getTopStore, requiredAmount } from '@/lib/board';
import { clp } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const cats = await getCategories();
  if (cats.length === 0) {
    return (
      <div className="space-y-12 pt-16">
        <section className="space-y-4 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
            TOP DE CHILE
          </h1>
          <p className="mx-auto max-w-xl text-lg text-mut">
            El ranking de tiendas de Chile que <strong>se compra</strong>. El Top 1 es
            de quien pague más — y todo Chile puede ver cuánto pagó.
          </p>
          <p className="text-sm text-mut">
            Estamos preparando los primeros rubros. Vuelve pronto.
          </p>
        </section>
      </div>
    );
  }
  const first = cats[0];
  const board = await getBoard(first.id, 5);
  const top = await getTopStore(first.id);
  const required = await requiredAmount(first.id);
  const stats = await getStats();

  return (
    <div className="space-y-14 pt-12">
      {/* Hero */}
      <section className="space-y-5 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
          El ranking que{' '}
          <span className="text-accent">se compra</span>
        </h1>
        <p className="mx-auto max-w-xl text-lg text-mut leading-relaxed">
          El Top 1 de cada rubro es de quien pague más.
          Todo queda público en el Ledger.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-sm font-medium text-mut">
          <VisitorCounter />
          <span className="rounded-full bg-card2 px-3.5 py-1.5">
            {stats.paidCount} coronaciones
          </span>
          <Link
            href="/ledger"
            className="rounded-full bg-card2 px-3.5 py-1.5 hover:bg-line transition-colors"
          >
            Ver Ledger →
          </Link>
        </div>
      </section>

      {/* Categorías */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-mut uppercase tracking-wider">
          Elige un rubro
        </h2>
        <div className="flex flex-wrap gap-2">
          {cats.map((c) => (
            <Link
              key={c.slug}
              href={'/categoria/' + c.slug}
              className={'tab ' + (c.slug === first.slug ? 'tab-active' : 'tab-idle')}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Board del primer rubro */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold">Top {first.name}</h2>
          <Link
            href={'/categoria/' + first.slug}
            className="text-sm font-medium text-accent hover:underline"
          >
            Ver ranking completo →
          </Link>
        </div>
        <Board
          catSlug={first.slug}
          catName={first.name}
          initial={board}
          topPrice={top?.current_price ?? null}
          required={required}
        />
      </section>

      {/* Cómo funciona */}
      <section className="space-y-4">
        <h2 className="text-xs font-semibold text-mut uppercase tracking-wider">
          Cómo funciona
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              step: '01',
              title: 'Paga',
              text:
                'Elige tu rubro y paga el mínimo para tomar el trono (hoy vale ' +
                clp(required) +
                ' en ' +
                first.name +
                ').',
            },
            {
              step: '02',
              title: 'Corona',
              text: 'Tu tienda queda #1 al instante, con tu link y tu badge verificada. El rey anterior baja un puesto.',
            },
            {
              step: '03',
              title: 'Defiende',
              text: 'Si otra tienda paga más, te destronan… y te avisamos para que reconquistes el trono.',
            },
          ].map((s) => (
            <div key={s.step} className="card p-6">
              <span className="text-xs font-bold text-accent">{s.step}</span>
              <h3 className="mt-2 text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mut">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="rounded-2xl bg-ink px-6 py-14 text-center">
        <h2 className="text-3xl font-extrabold text-white">¿Tu tienda se atreve?</h2>
        <p className="mx-auto mt-3 max-w-md text-white/60 leading-relaxed">
          Pymes, medianas y grandes: el trono se toma con plata y un buen producto.
        </p>
        <Link
          href="/reclamar"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-ink transition-all hover:bg-white/90 hover:-translate-y-0.5"
        >
          Reclamar el Top 1
        </Link>
      </section>
    </div>
  );
}
