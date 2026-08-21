import { NextRequest, NextResponse } from 'next/server';
import { getBoard, getCategoryBySlug, getTopStore, requiredAmount } from '@/lib/board';

export async function GET(req: NextRequest) {
  const cat = req.nextUrl.searchParams.get('cat') || '';
  const category = await getCategoryBySlug(cat);
  if (!category) {
    return NextResponse.json({ ok: false, error: 'Categoría no existe' }, { status: 404 });
  }
  const [stores, top, required] = await Promise.all([
    getBoard(category.id),
    getTopStore(category.id),
    requiredAmount(category.id),
  ]);
  return NextResponse.json({
    ok: true,
    category: { slug: category.slug, name: category.name },
    topPrice: top?.current_price ?? null,
    required,
    stores: stores.map((s) => ({
      id: s.id,
      slug: s.slug,
      name: s.name,
      url: s.url,
      logo_url: s.logo_url,
      pitch: s.pitch,
      position: s.position,
      current_price: s.current_price,
      verified: s.verified,
      claimed_at: s.claimed_at,
    })),
  });
}
