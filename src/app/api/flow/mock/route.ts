import { getTxByOrder } from '@/lib/board';
import { config } from '@/lib/config';
import { clp } from '@/lib/format';

/**
 * Checkout SIMULADO (modo demo, sin cuenta Flow).
 * Muestra la orden y al "pagar" llama al webhook real, que liquida el trono.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const order = url.searchParams.get('order') || '';
  const tx = await getTxByOrder(order);

  if (!tx) {
    return new Response('Orden no encontrada', { status: 404 });
  }

  const returnUrl =
    config.siteUrl + '/?king=' + encodeURIComponent(tx.store_slug) + '&cat=' + tx.cat_slug;

  const html = [
    '<!DOCTYPE html>',
    '<html lang="es-CL">',
    '<head>',
    '<meta charset="utf-8" />',
    '<meta name="viewport" content="width=device-width, initial-scale=1" />',
    '<title>Pagar - EL TRONO \u{1F451}</title>',
    '<style>',
    '  body{background:#0a0a13;color:#f4f4fa;font-family:"Segoe UI",system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:16px}',
    '  .card{background:#12121f;border:1px solid #27273d;border-radius:20px;padding:32px;max-width:420px;width:100%;text-align:center}',
    '  h1{font-size:22px;margin:0 0 4px;color:#f5c542}',
    '  .tag{font-size:12px;text-transform:uppercase;letter-spacing:2px;color:#9a9ab5;margin-bottom:20px}',
    '  .row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #27273d;font-size:14px}',
    '  .row b{color:#ffdf8e}',
    '  .amount{font-size:40px;font-weight:900;color:#f5c542;margin:20px 0;text-shadow:0 0 24px rgba(245,197,66,.4)}',
    '  button{width:100%;margin-top:20px;padding:14px;border:none;border-radius:12px;font-weight:900;font-size:14px;text-transform:uppercase;letter-spacing:1px;color:#0a0a13;background:linear-gradient(135deg,#f5c542,#ffdf8e);cursor:pointer}',
    '  button:disabled{opacity:.6;cursor:wait}',
    '  .note{margin-top:14px;font-size:11px;color:#6b6b80}',
    '</style>',
    '</head>',
    '<body>',
    '<div class="card">',
    '  <div class="tag">Checkout simulado - modo demo</div>',
    '  <h1>EL TRONO \u{1F451}</h1>',
    '  <p class="tag">' + tx.cat_slug.toUpperCase() + '</p>',
    '  <div class="row"><span>Tienda</span><b>' + tx.store_slug + '</b></div>',
    '  <div class="row"><span>Orden</span><b>' + tx.flow_order + '</b></div>',
    '  <div class="row"><span>Estado</span><b>Pendiente</b></div>',
    '  <div class="amount">' + clp(tx.amount_clp) + '</div>',
    '  <button id="pay">Pagar ' + clp(tx.amount_clp) + ' (simulado)</button>',
    '  <p class="note">Con Flow.cl real esto seria la pasarela de pago con tarjeta o transferencia.</p>',
    '</div>',
    '<script>',
    "  var btn = document.getElementById('pay');",
    "  btn.addEventListener('click', function () {",
    "    btn.disabled = true; btn.textContent = 'Procesando...';",
    '    var body = new URLSearchParams({',
    "      commerceOrder: '" + tx.flow_order + "',",
    "      status: 'paid',",
    "      amount: String(" + tx.amount_clp + ')',
    '    });',
    "    fetch('/api/flow/webhook', { method: 'POST', body: body })",
    '      .then(function (r) { if (!r.ok) throw new Error(r.status); })',
    "      .then(function () { window.location.href = '" + returnUrl + "'; })",
    "      .catch(function () { btn.disabled = false; btn.textContent = 'Error, intenta de nuevo'; });",
    '  });',
    '</script>',
    '</body>',
    '</html>',
  ].join('\n');

  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
