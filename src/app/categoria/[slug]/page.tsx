import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Board from '@/components/Board';
import { getBoard, getCategories, getCategoryBySlug, getTopStore, requiredAmount } from '@/lib/board';
import { clp } from '@/lib/format';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug);
  if (!cat) return { title: 'Categoría no encontrada' };
  const top = await getTopStore(cat.id);
  return {
    title:
      'Top ' + cat.name + ' - el trono vale ' + (top ? clp(top.current_price ?? 0) : clp(await requiredAmount(cat.id))),
    description:
      'Ranking pagado de ' + cat.name + ' en Chile. El Top 1 es de quien pague más. ' +
      (top
        ? 'Hoy el trono vale ' + clp(top.current_price ?? 0) + '.'
        : '¿Te lo llevas?'),
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug);
  if (!cat) notFound();

  const [board, top, required, cats] = await Promise.all([
    getBoard(cat.id),
    getTopStore(cat.id),
    requiredAmount(cat.id),
    getCategories(),
  ]);

  return (
    <div className="space-y-8 pt-10">
      <div className="space-y-3">
        <Link href="/" className="text-sm font-bold text-neon hover:underline">
          ← Ranking
        </Link>
        <h1 className="text-4xl font-black sm:text-5xl">
          Top {cat.name}
        </h1>
        {cat.description && <p className="text-mut">{cat.description}</p>}
        <p className="text-sm font-bold text-goldsoft">
          El trono hoy vale {clp(top?.current_price ?? 0)} — mínimo para tomarlo:{' '}
          {clp(required)}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {cats.map((c) => (
          <Link
            key={c.slug}
            href={'/categoria/' + c.slug}
            className={'chip ' + (c.slug === slug ? 'chip-active' : 'chip-idle')}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <Board
        catSlug={cat.slug}
        catName={cat.name}
        initial={board}
        topPrice={top?.current_price ?? null}
        required={required}
      />
    </div>
  );
}
