# EL TRONO 👑

**El ranking de tiendas de Chile que se compra.** El Top 1 es de quien pague más: una tienda paga el mínimo para coronarse #1, otra paga más y la destrona (la anterior baja un puesto). Cada peso queda público en el Ledger.

## Requisitos

- Node.js 24+ (usa `node:sqlite` nativo — cero dependencias nativas)

## Puesta en marcha

```bash
npm install
npm run seed        # siembra categorías + tiendas demo + ledger de ejemplo
npm run dev         # http://localhost:3000
```

> Para re-sembrar desde cero: `npm run seed:reset`

## Probar el flujo completo (modo demo)

1. Abre `http://localhost:3000` — verás el ranking con tiendas demo.
2. Ve a **Reclamar Top 1**, completa el formulario (monto mínimo pre-calculado) y paga.
3. Aparece el **checkout simulado** (no necesitas cuenta Flow). Al «pagar», la tienda se corona #1:
   - el rey anterior baja un puesto,
   - cae **confetti** en el ranking,
   - la batalla queda en el **Ledger** público,
   - la tienda recibe su **ficha** con URL propia (`/tienda/<slug>`).
4. `/admin` (token: `eltrono-admin`, cámbialo con `ADMIN_TOKEN`) — verifica tiendas, borra, purga demos.

## Widget embebible (para las tiendas)

```html
<script src="http://localhost:3000/api/widget.js" data-store="mi-tienda" data-theme="dark"></script>
```

Renderiza la badge con la posición actual. Temas: `dark` (default) / `light`.

## Pagos reales (Flow.cl)

1. Crea cuenta en [flow.cl](https://www.flow.cl) (sin costo mensual, comisión por transacción).
2. En el panel → **Integración API** → credenciales del comercio.
3. En `.env`:

```
MOCK_PAYMENTS=false
FLOW_API_KEY=xxxx
FLOW_SECRET=yyyy
SITE_URL=https://tu-dominio.cl
```

El webhook de confirmación es `POST /api/flow/webhook` (urlConfirmation) — firma verificada con md5 estilo Flow. Con `MOCK_PAYMENTS=true` (default sin credenciales) el checkout es simulado.

## Reglas del juego (configurables en `.env`)

| Variable | Default | Qué hace |
|---|---|---|
| `STARTING_PRICE` | `1000` | Precio base del trono en un rubro vacío (~1 USD) |
| `MIN_INCREMENT` | `500` | Incremento mínimo para destronar |
| `ADMIN_TOKEN` | `eltrono-admin` | Token de `/admin` |
| `SITE_URL` | `http://localhost:3000` | URL pública (para Flow, widget y SEO) |

## Estructura

```
src/
  app/            páginas + API routes (Next.js App Router, SSR para SEO)
  lib/
    db.ts         SQLite nativo (node:sqlite), schema + migración
    board.ts      lógica del juego: reclamo, destronamiento, ledger, admin
    flow.ts       integración Flow.cl (real + mock)
  components/
    Board.tsx     ranking vivo: polling 15s + confetti al destronar
    ClaimForm.tsx formulario de reclamo con precio dinámico
scripts/seed.mts  datos demo
```

## Producción (notas)

- **Deploy**: Vercel no sirve bien SQLite en serverless (filesystem efímero). Opciones: (a) VPS/Docker con volumen persistente, o (b) swap de `lib/db.ts` a Postgres/Supabase manteniendo `lib/board.ts` intacto — la lógica está aislada de la capa de datos.
- **SEO**: cada tienda y categoría tiene URL propia con metadata; `sitemap.xml` automático.
- **Legal**: el footer y el formulario declaran que es un ranking 100% pagado (transparencia publicitaria). Los links a tiendas llevan `rel="sponsored nofollow"`.

## Disclaimer

Esto es un MVP. Los pagos simulados no mueven plata real; cuando actives Flow.cl, prueba primero en su entorno de testing.
