import type { Metadata } from 'next';
import ClaimForm, { type CatOpt } from '@/components/ClaimForm';
import { getCategories, getTopStore, requiredAmount } from '@/lib/board';
import { config } from '@/lib/config';
import { clp } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Reclama el Top 1',
  description:
    'Toma el trono de tu rubro: paga el mínimo y tu tienda queda #1 en el ranking pagado de Chile.',
};

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<{ cat?: string }>;
}

export default async function ReclamarPage({ searchParams }: Props) {
  const { cat } = await searchParams;
  const rawCats = await getCategories();
  const cats: CatOpt[] = await Promise.all(
    rawCats.map(async (c) => {
      const top = await getTopStore(c.id);
      return {
        slug: c.slug,
        name: c.name,
        topPrice: top?.current_price ?? null,
        required: await requiredAmount(c.id),
      };
    })
  );
  const defaultCat = cats.some((c) => c.slug === cat) ? (cat as string) : cats[0].slug;

  return (
    <div className="mx-auto max-w-3xl space-y-8 pt-10">
      <div className="space-y-3 text-center">
        <h1 className="crown-glow text-4xl font-black text-gold sm:text-5xl">
          Reclama el Top 1 👑
        </h1>
        <p className="text-mut">
          Paga el mínimo, queda #1 al instante. Si alguien paga más… te destronan. Así de simple.
        </p>
      </div>

      <ClaimForm cats={cats} defaultCat={defaultCat} minIncrement={config.minIncrement} />

      <div className="card space-y-4 p-6 text-sm">
        <h2 className="font-black text-goldsoft">¿Cómo funciona?</h2>
        <ol className="list-decimal space-y-2 pl-5 text-mut">
          <li>
            Elige tu rubro y paga el mínimo. Hoy el trono más barato parte en{' '}
            <b className="text-goldsoft">{clp(Math.min(...cats.map((c) => c.required)))}</b>.
          </li>
          <li>
            Tu tienda se corona <b className="text-goldsoft">#1</b> con su link, su logo y su badge.
            El rey anterior baja un puesto.
          </li>
          <li>
            Si otra tienda ofrece más, te destronan. Te avisamos por email para que reconquistes el
            trono.
          </li>
        </ol>
        <p className="rounded-xl border border-line bg-panel2 p-4 text-xs leading-relaxed text-mut">
          ⚖️ <b className="text-goldsoft">Transparencia total:</b> este es un ranking 100% pagado, no
          editorial. Cada peso pagado es público en el Ledger. Las posiciones se compran y se pierden
          — sin reembolsos, porque lo que compras es visibilidad pública verificable.
        </p>
      </div>
    </div>
  );
}
