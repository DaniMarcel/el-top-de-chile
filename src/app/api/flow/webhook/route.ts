import { NextRequest, NextResponse } from 'next/server';
import { settlePaid } from '@/lib/board';
import { getFlowPaymentStatus } from '@/lib/flow';
import { config } from '@/lib/config';

/**
 * Webhook de confirmación de pago (Flow.cl → urlConfirmation).
 *
 * Flow envía un POST form-urlencoded con un `token`; para confirmar el pago
 * hay que llamar a payment/getStatus con ese token y verificar que esté
 * aprobado y que el monto/orden coincidan. Solo entonces se destrona.
 *
 * En modo demo lo llama el checkout simulado de /api/flow/mock (con commerceOrder).
 * Idempotente: liquidar dos veces la misma orden no cambia nada.
 */
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const params: Record<string, string> = {};
  form.forEach((v, k) => {
    params[k] = String(v);
  });

  // --- Modo demo: el checkout simulado manda commerceOrder directo ---
  if (config.mockPayments) {
    const orderId = params.commerceOrder || '';
    if (!orderId) return new NextResponse('NO_ORDER', { status: 400 });
    settlePaid(orderId);
    return new NextResponse('OK', { status: 200 });
  }

  // --- Modo real: validar token contra Flow ---
  const token = params.token || '';
  if (!token) return new NextResponse('NO_TOKEN', { status: 400 });

  const status = await getFlowPaymentStatus(token);
  if (!status) return new NextResponse('INVALID_TOKEN', { status: 400 });

  // Flow: 1 = aprobado
  if (status.status !== '1' && status.status !== 'Aprobado') {
    return new NextResponse('NOT_PAID', { status: 200 });
  }

  settlePaid(status.commerceOrder);
  return new NextResponse('OK', { status: 200 });
}
