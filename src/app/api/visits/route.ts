import { NextResponse } from 'next/server';
import { getVisitStats } from '@/lib/board';

export async function GET() {
  const stats = await getVisitStats();
  return NextResponse.json({ ok: true, ...stats });
}
