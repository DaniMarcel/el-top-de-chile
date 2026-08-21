import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config';

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const token = String(form.get('token') || '');
  const res = NextResponse.redirect(new URL('/admin', req.url), 303);
  if (token === config.adminToken) {
    res.cookies.set('eltrono_admin', '1', {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
  }
  return res;
}
