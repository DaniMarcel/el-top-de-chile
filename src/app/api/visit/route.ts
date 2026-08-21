import { NextRequest, NextResponse } from 'next/server';
import { recordVisit } from '@/lib/board';

/**
 * Registra la visita de un visitante (IP hasheada por privacidad).
 * Lo llama el componente VisitorCounter al cargar la página.
 */
export async function POST(req: NextRequest) {
  const fwd = req.headers.get('x-forwarded-for') || '';
  const real = req.headers.get('x-real-ip') || '';
  const ip = (fwd.split(',')[0] || real || 'local').trim();

  // Ignora bots/crawlers para no inflar las cifras
  const ua = (req.headers.get('user-agent') || '').toLowerCase();
  if (/bot|spider|crawl|preview|slurp|curl|wget/i.test(ua)) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  await recordVisit(ip);
  return NextResponse.json({ ok: true });
}
