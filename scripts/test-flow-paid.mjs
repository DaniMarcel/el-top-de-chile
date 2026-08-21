/** Consulta el estado del pago pagado (178909944) para verificar el flujo */
import crypto from 'node:crypto';

const API_KEY = '4368FEBF-F228-4F90-97CD-3ADL466F332E';
const SECRET = '32e008abb8827bf2a2d7eaff86d0e77cd441071c';

function sign(params, secret) {
  const keys = Object.keys(params).sort();
  const str = keys.map((k) => `${k}${params[k]}`).join('');
  return crypto.createHmac('sha256', secret).update(str).digest('hex');
}

// Buscar por flowOrder
const params = { apiKey: API_KEY, flowOrder: '178909944' };
params.s = sign(params, SECRET);

const res = await fetch('https://www.flow.cl/api/payment/getStatus?' + new URLSearchParams(params).toString());
const data = await res.json();
console.log('Estado completo:', JSON.stringify(data, null, 1).slice(0, 800));
