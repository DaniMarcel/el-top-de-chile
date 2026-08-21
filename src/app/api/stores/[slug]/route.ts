import { NextRequest, NextResponse } from 'next/server';
import { getStoreBySlug } from '@/lib/board';

/** Datos para el widget embebible: estado actual de una tienda. */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  if (!store) {
    return NextResponse.json({ ok: false, error: 'Tienda no encontrada' }, { status: 404 });
  }
  return NextResponse.json({
    ok: true,
    store: {
      name: store.name,
      slug: store.slug,
      url: store.url,
      position: store.position,
      current_price: store.current_price,
      verified: store.verified,
    },
    category: { name: store.cat_name, slug: store.cat_slug },
  });
}
