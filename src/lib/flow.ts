import crypto from 'node:crypto';
import { config } from './config.ts';

/**
 * Firma estilo Flow.cl (API actual): HMAC-SHA256 con el secretKey como llave.
 * Los parámetros se ordenan alfabéticamente y se concatenan nombre+valor (sin "s").
 */
function sign(params: Record<string, string>, secret: string): string {
  const keys = Object.keys(params).sort();
  const str = keys.map((k) => `${k}${params[k]}`).join('');
  return crypto.createHmac('sha256', secret).update(str).digest('hex');
}

export interface FlowOrder {
  orderId: string;
  amount: number;
  subject: string;
  email: string;
  urlReturn: string;
  urlConfirmation: string;
}

/**
 * Crea la orden de pago.
 * - Modo demo (MOCK_PAYMENTS=true): devuelve una URL local con checkout simulado.
 * - Modo real: crea la orden en Flow.cl y devuelve la URL de pago de Flow.
 */
export async function createFlowPayment(opts: FlowOrder): Promise<string> {
  if (config.mockPayments) {
    return config.siteUrl + '/api/flow/mock?order=' + encodeURIComponent(opts.orderId);
  }

  const params: Record<string, string> = {
    apiKey: config.flowApiKey,
    commerceOrder: opts.orderId,
    subject: opts.subject.slice(0, 120),
    currency: 'CLP',
    amount: String(opts.amount),
    email: opts.email,
    urlConfirmation: opts.urlConfirmation,
    urlReturn: opts.urlReturn,
  };
  params.s = sign(params, config.flowSecret);

  const res = await fetch('https://www.flow.cl/api/payment/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(params).toString(),
  });
  const data = await res.json();
  if (!data.url || !data.token) {
    throw new Error('Flow.cl respondió un error: ' + JSON.stringify(data));
  }
  return data.url;
}

/**
 * Verifica la firma del webhook de Flow.cl (en modo demo siempre válido).
 * NOTA: el webhook real de Flow envía un `token`; la app debe llamar a
 * payment/getStatus con ese token para confirmar el pago (ver verifyPayment).
 */
export function verifyFlowWebhook(params: Record<string, string>): boolean {
  if (config.mockPayments) return true;
  const { s, ...rest } = params;
  if (!s) return false;
  return sign(rest, config.flowSecret) === s;
}

/**
 * Consulta el estado real de un pago en Flow (payment/getStatus).
 * Se llama con el token que Flow envía al webhook, para confirmar
 * que el pago está "Aprobado" antes de destronar.
 */
export async function getFlowPaymentStatus(token: string): Promise<{
  status: string;
  amount: number;
  commerceOrder: string;
} | null> {
  const params: Record<string, string> = {
    apiKey: config.flowApiKey,
    token,
  };
  params.s = sign(params, config.flowSecret);

  const res = await fetch('https://www.flow.cl/api/payment/getStatus?' + new URLSearchParams(params).toString());
  const data = await res.json();
  if (!data || data.code) return null;
  return {
    status: String(data.status || ''),
    amount: Number(data.amount || 0),
    commerceOrder: String(data.commerceOrder || ''),
  };
}
