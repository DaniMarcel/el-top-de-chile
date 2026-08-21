import { config } from '@/lib/config';

/**
 * Widget embebible para que las tiendas lo pongan en su propia web:
 *   <script src="https://TU-DOMINIO/api/widget.js" data-store="mi-tienda" data-theme="dark"></script>
 * Renderiza una badge con la posición actual de la tienda en EL TRONO.
 *
 * Nota: el payload se arma con strings planos (sin template literals)
 * para evitar problemas de parseo de SWC/Turbopack con caracteres no-ASCII.
 */
export async function GET() {
  const js = [
    '(function () {',
    '  var SITE = ' + JSON.stringify(config.siteUrl) + ';',
    "  var script = document.currentScript;",
    "  if (!script) return;",
    "  var store = script.getAttribute('data-store') || '';",
    "  var theme = script.getAttribute('data-theme') === 'light' ? 'light' : 'dark';",
    '  if (!store) return;',
    '',
    "  var wrap = document.createElement('div');",
    "  wrap.style.all = 'initial';",
    "  var id = 'eltrono-' + Math.random().toString(36).slice(2, 9);",
    '  wrap.id = id;',
    '  if (script.parentNode) script.parentNode.insertBefore(wrap, script);',
    '',
    '  function esc(s) {',
    "    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')",
    "      .replace(/>/g, '&gt;').replace(/\"/g, '&quot;');",
    '  }',
    '  function money(n) {',
    "    return '$' + Number(n || 0).toLocaleString('es-CL');",
    '  }',
    '',
    "  fetch(SITE + '/api/stores/' + encodeURIComponent(store) + '?t=' + Date.now())",
    '    .then(function (r) { return r.json(); })',
    '    .then(function (d) {',
    "      if (!d.ok || !d.store) { wrap.innerHTML = ''; return; }",
    '      var s = d.store;',
    "      var c = theme === 'light'",
    "        ? { bg: '#ffffff', border: '#e4e4ee', text: '#15151f', mut: '#6b6b80', gold: '#b8860b', link: '#0e7490', chip: '#f7f2e3' }",
    "        : { bg: '#0f0f1a', border: '#2a2a42', text: '#f2f2f8', mut: '#9a9ab5', gold: '#f5c542', link: '#22d3ee', chip: '#1a1a2c' };",
    '',
    "      var crown = s.position === 1 ? '\\u{1F451}' : (s.position ? '#' + s.position : '-');",
    '      var status = s.position',
    "        ? (s.position === 1 ? 'REY ACTUAL de ' : 'Top ' + s.position + ' en ') + d.category.name",
    "        : 'Fuera del ranking';",
    "      var verified = s.verified ? ' ✓ verificada' : '';",
    '      var price = s.position && s.current_price',
    "        ? 'pagó ' + money(s.current_price) + ' por el trono'",
    "        : '';",
    '',
    '      wrap.innerHTML =',
    "        '<div style=\"display:inline-block;max-width:360px;background:' + c.bg +",
    "        ';border:1px solid ' + c.border + ';border-radius:14px;padding:12px 16px;' +",
    "        'font-family:Segoe UI,system-ui,-apple-system,Arial,sans-serif;font-size:13px;' +",
    "        'color:' + c.text + ';box-shadow:0 4px 20px rgba(0,0,0,.25);text-align:left\">' +",
    "          '<div style=\"display:flex;align-items:center;gap:8px\">' +",
    "            '<span style=\"font-size:22px;line-height:1\">' + crown + '</span>' +",
    "            '<span style=\"font-weight:800;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:' + c.gold + '\">' + esc(status) + '</span>' +",
    '          \'</div>\' +',
    "          '<div style=\"margin-top:6px;font-weight:700;font-size:15px\">' + esc(s.name) +",
    "            '<span style=\"font-size:11px;color:' + c.mut + '\">' + esc(verified) + '</span></div>' +",
    "          (price ? '<div style=\"margin-top:2px;color:' + c.mut + '\">' + esc(price) + '</div>' : '') +",
    "          '<div style=\"margin-top:8px;font-size:11px\">' +",
    "            '<a href=\"' + esc(SITE + '/tienda/' + s.slug) + '\" target=\"_blank\" rel=\"noopener\" style=\"color:' + c.link + ';font-weight:700;text-decoration:none\">Ver en EL TRONO \\u{2197}</a>' +",
    "          '</div>' +",
    "        '</div>';",
    '    })',
    "    .catch(function () { wrap.innerHTML = ''; });",
    '})();',
  ].join('\n');

  return new Response(js, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
}
