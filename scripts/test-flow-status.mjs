/** Consulta el estado de la orden de prueba en Flow para ver si el comercio está activo */
import crypto from 'node:crypto';

const API_KEY = '4368FEBF-F228-4F90-97CD-3ADL466F332E';
const SECRET = '32e008abb8827bf2a2d7eaff86d0e77cd441071c';

function sign(params, secret) {
  const keys = Object.keys(params).sort();
  const str = keys.map((k) => `${k}${params[k]}`).join('');
  return crypto.createHmac('sha256', secret).update(str).digest('hex');
}

const token = '8BFC2B2ECAB369869B2B9FF0024C7C50A7553D6V';
const params = { apiKey: API_KEY, token };
params.s = sign(params, SECRET);

const res = await fetch('https://www.flow.cl/api/payment/getStatus?' + new URLSearchParams(params).toString());
const text = await res.text();
console.log('STATUS:', res.status);
console.log('RESPONSE:', text.slice(0, 400));
