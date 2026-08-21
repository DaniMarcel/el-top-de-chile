import { NextRequest, NextResponse } from 'next/server';
import { createClaim } from '@/lib/board';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await createClaim({
      name: String(body.name ?? ''),
      email: String(body.email ?? ''),
      url: String(body.url ?? ''),
      logoUrl: String(body.logoUrl ?? ''),
      pitch: String(body.pitch ?? ''),
      categorySlug: String(body.categorySlug ?? ''),
      amount: Number(body.amount),
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error inesperado.';
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
}
