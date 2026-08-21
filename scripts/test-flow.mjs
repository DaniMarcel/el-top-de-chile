/**
 * Prueba Flow.cl con firma HMAC-SHA256 (la actual) en el endpoint correcto.
 * Uso: node scripts/test-flow.mjs
 */
import crypto from 'node:crypto';

const API_KEY = '4368FEBF-F228-4F90-97CD-3ADL466F332E';
const SECRET = '32e008abb8827bf2a2d7eaff86d0e77cd441071c';

function sign(params, secret) {
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
  email: 'daniel.marcel@inacapmail.cl',
  urlConfirmation: 'https://el-trono.vercel.app/api/flow/webhook',
  urlReturn: 'https://el-trono.vercel.app/',
};
params.s = sign(params, SECRET);

const res = await fetch('https://www.flow.cl/api/payment/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams(params).toString(),
});
const data = await res.json();

if (data.url && data.token) {
  console.log('OK credenciales válidas + firma HMAC ✅');
  console.log('URL de pago:', data.url);
} else {
  console.log('ERROR:', JSON.stringify(data));
  process.exitCode = 1;
}
