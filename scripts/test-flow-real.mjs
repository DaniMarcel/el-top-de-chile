/**
 * Reproduce exactamente lo que hace la app al reclamar: crea una orden en Flow
 * y muestra la respuesta cruda para diagnosticar "Error Processing Request".
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
  commerceOrder: 'TR-TEST-' + Date.now(),
  subject: 'Top de Chile - Ropa - Tienda Test',
  currency: 'CLP',
  amount: '1500',
  email: 'daniel.marcel@inacapmail.cl',
  urlConfirmation: 'https://el-trono.vercel.app/api/flow/webhook',
  urlReturn: 'https://el-trono.vercel.app/?king=tienda-test&cat=ropa',
};
params.s = sign(params, SECRET);

const res = await fetch('https://www.flow.cl/api/payment/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams(params).toString(),
});
const text = await res.text();
console.log('STATUS:', res.status);
console.log('RESPONSE:', text.slice(0, 400));
