import { NextRequest, NextResponse } from 'next/server';
import { settlePaid } from '@/lib/board';
import { verifyFlowWebhook } from '@/lib/flow';

/**
 * Webhook de confirmación de pago (Flow.cl → urlConfirmation).
 * En modo demo lo llama el checkout simulado de /api/flow/mock.
 * Idempotente: liquidar dos veces la misma orden no cambia nada.
 */
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const params: Record<string, string> = {};
  form.forEach((v, k) => {
    params[k] = String(v);
  });

  if (!verifyFlowWebhook(params)) {
    return new NextResponse('INVALID_SIGNATURE', { status: 400 });
  }

  const orderId = params.commerceOrder || params['commerceOrder'] || '';
  if (!orderId) {
    return new NextResponse('NO_ORDER', { status: 400 });
  }

  await settlePaid(orderId);
  return new NextResponse('OK', { status: 200 });
}
