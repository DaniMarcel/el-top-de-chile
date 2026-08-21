import { NextRequest, NextResponse } from 'next/server';
import { deleteStore, purgeDemo, verifyStore } from '@/lib/board';

export async function POST(req: NextRequest) {
  const authed = req.cookies.get('eltrono_admin')?.value === '1';
  const redirect = NextResponse.redirect(new URL('/admin', req.url), 303);
  if (!authed) return redirect;

  const form = await req.formData();
  const action = String(form.get('action') || '');

  if (action === 'verify') {
    const id = Number(form.get('id'));
    const verified = form.get('verified') === '1';
    if (id) await verifyStore(id, verified);
  } else if (action === 'delete') {
    const id = Number(form.get('id'));
    if (id) await deleteStore(id);
  } else if (action === 'purge') {
    if (form.get('confirm') === 'si') await purgeDemo();
  }

  return redirect;
}
