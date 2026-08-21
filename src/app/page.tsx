import Link from 'next/link';
import Board from '@/components/Board';
import VisitorCounter from '@/components/VisitorCounter';
import { getBoard, getCategories, getStats, getTopStore, requiredAmount } from '@/lib/board';
import { clp } from '@/lib/format';

export default async function Home() {
  const cats = await getCategories();
  const first = cats[0];
  const board = await getBoard(first.id, 5);
  const top = await getTopStore(first.id);
  const required = await requiredAmount(first.id);
  const stats = await getStats();

  return (
    <div className="space-y-12 pt-10">
      {/* Hero */}
      <section className="space-y-5 text-center">
        <h1 className="crown-glow text-5xl font-black tracking-tight text-gold sm:text-7xl">
          TOP DE CHILE 👑
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-mut sm:text-xl">
          El ranking de tiendas de Chile que <b className="text-goldsoft">se compra</b>. El Top 1 es
          de quien pague más — y todo Chile puede ver cuánto pagó.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-sm font-bold text-mut">
          <VisitorCounter />
          <span className="rounded-full border border-line px-4 py-1.5">
            👑 {stats.paidCount} coronaciones
          </span>
          <Link href="/ledger" className="rounded-full border border-line px-4 py-1.5 hover:border-neon hover:text-neon transition-colors">
            Ledger público →
          </Link>
        </div>
      </section>

      {/* Categorías */}
      <section className="space-y-4">
        <h2 className="text-xs font-black uppercase tracking-[0.25em] text-mut">
          Elige tu rubro
        </h2>
        <div className="flex flex-wrap gap-2">
          {cats.map((c) => (
            <Link
              key={c.slug}
              href={'/categoria/' + c.slug}
              className={'chip ' + (c.slug === first.slug ? 'chip-active' : 'chip-idle')}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Board del primer rubro */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-black">Top {first.name}</h2>
          <Link
            href={'/categoria/' + first.slug}
            className="text-sm font-bold text-neon hover:underline"
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
      <section className="grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: '💸',
            title: '1 · Paga',
            text:
              'Elige tu rubro y paga el mínimo para tomar el trono (hoy vale ' +
              clp(required) +
              ' en ' +
              first.name +
              ').',
          },
          {
            icon: '🏆',
            title: '2 · Corona',
            text: 'Tu tienda queda #1 al instante, con tu link y tu badge verificada. El rey anterior baja un puesto.',
          },
          {
            icon: '⚔️',
            title: '3 · Defiende',
            text: 'Si otra tienda paga más, te destronan… y te avisamos para que reconquistes el trono.',
          },
        ].map((s) => (
          <div key={s.title} className="card p-6">
            <div className="text-3xl">{s.icon}</div>
            <h3 className="mt-3 font-black text-goldsoft">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-mut">{s.text}</p>
          </div>
        ))}
      </section>

      {/* CTA final */}
      <section className="card animate-pulsegold border-gold/60 bg-gradient-to-br from-gold/10 via-panel to-panel px-6 py-10 text-center">
        <h2 className="text-3xl font-black text-goldsoft">¿Tu tienda se atreve?</h2>
        <p className="mx-auto mt-2 max-w-md text-mut">
          Pymes, medianas y grandes: el trono se toma con plata, huevos y un buen logo.
        </p>
        <Link href="/reclamar" className="btn-claim mt-6">
          👑 Reclama el Top 1
        </Link>
      </section>
    </div>
  );
}
