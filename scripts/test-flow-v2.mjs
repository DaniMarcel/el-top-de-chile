/**
 * Prueba Flow API v2: body JSON + firma HMAC-SHA256.
 */
import crypto from 'node:crypto';

const API_KEY = '4368FEBF-F228-4F90-97CD-3ADL466F332E';
const SECRET = '32e008abb8827bf2a2d7eaff86d0e77cd441071c';

function signHmac(params, secret) {
  const keys = Object.keys(params).sort();
  const str = keys.map((k) => `${k}${params[k]}`).join('');
  return crypto.createHmac('sha256', secret).update(str).digest('hex');
}

const params = {
  apiKey: API_KEY,
  commerceOrder: 'TEST-' + Date.now(),
  subject: 'Prueba TOP DE CHILE',
  currency: 'CLP',
  amount: '500',
  email: 'test@topdechile.cl',
  urlConfirmation: 'https://el-trono.vercel.app/api/flow/webhook',
  urlReturn: 'https://el-trono.vercel.app/',
};
params.s = signHmac(params, SECRET);

const res = await fetch('https://www.flow.cl/api/v2/payment/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(params),
});
const data = await res.json();
console.log('RESP:', JSON.stringify(data).slice(0, 300));
if (data.url) console.log('OK URL:', data.url);
else process.exitCode = 1;
