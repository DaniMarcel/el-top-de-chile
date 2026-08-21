/** Crea orden de pago con el email REAL del comercio para probar pay.php */
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
  subject: 'Prueba Top de Chile',
  currency: 'CLP',
  amount: '500',
  email: 'danielmarcelrivera@gmail.com', // email del comercio (cuenta Flow)
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
console.log('RESP:', JSON.stringify(data).slice(0, 300));
if (data.url) console.log('\nABRE ESTA URL EN EL NAVEGADOR:\n' + data.url);
