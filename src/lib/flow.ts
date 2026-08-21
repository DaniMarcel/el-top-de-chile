import crypto from 'node:crypto';
import { config } from './config.ts';

/** Firma estilo Flow.cl: md5(secret + params ordenados alfabéticamente concatenados k+v) */
function sign(params: Record<string, string>, secret: string): string {
  const keys = Object.keys(params).sort();
  const str = keys.map((k) => `${k}${params[k]}`).join('');
  return crypto.createHash('md5').update(secret + str).digest('hex');
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

/** Verifica la firma del webhook de Flow.cl (en modo demo siempre válido). */
export function verifyFlowWebhook(params: Record<string, string>): boolean {
  if (config.mockPayments) return true;
  const { s, ...rest } = params;
  if (!s) return false;
  return sign(rest, config.flowSecret) === s;
}
