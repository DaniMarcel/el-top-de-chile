# EL TRONO 👑

**El ranking de tiendas de Chile que se compra.** El Top 1 es de quien pague más: una tienda paga el mínimo para coronarse #1, otra paga más y la destrona (la anterior baja un puesto). Cada peso queda público en el Ledger.

## Requisitos

- Node.js 24+ (usa `node:sqlite` nativo en dev — cero dependencias nativas)

## Desarrollo local

```bash
npm install
npm run seed        # siembra categorías + tiendas demo + ledger de ejemplo
npm run dev         # http://localhost:3000
```

> Re-sembrar desde cero: `npm run seed:reset`

**Probar el flujo completo (modo demo):** ve a **Reclamar Top 1**, completa el formulario y paga en el checkout simulado (sin cuenta Flow). Verás confetti, el destronamiento, el Ledger y la ficha de la tienda. Admin en `/admin` (token: `eltrono-admin`).

## Contador de visitantes

El home muestra **visitantes en línea** (últimos 5 min) y **visitas únicas en 24 h**. Se registra automáticamente al cargar la página; bots/crawlers se ignoran y las IP se usan solo para contar (sin guardar datos personales).

## Producción: Vercel + Supabase ($0)

La app usa **SQLite en dev** y **Postgres (Supabase) en producción**, elegido automáticamente por la variable `DATABASE_URL`. La lógica del juego es idéntica en ambos.

### 1. Supabase (la base de datos)

1. Crea un proyecto gratis en [supabase.com](https://supabase.com) (región **South America (São Paulo)** para mejor latencia en Chile).
2. Ve a **SQL Editor** → New query → pega el contenido de `supabase/schema.sql` → **Run**. Esto crea tablas + categorías.
3. Ve a **Project Settings → Database → Connection string → URI** y copia la URL (usa el **pooler** `:6543` para serverless).
4. (Opcional) Siembra tiendas demo contra Supabase:
   ```bash
   DATABASE_URL="postgresql://postgres.XXXX:pass@aws-0-sa-east-1.pooler.supabase.com:6543/postgres" npm run seed
   ```

### 2. Vercel

1. Sube el proyecto a GitHub (puedes crear el repo con `gh repo create` o desde github.com → New repository → push).
2. En [vercel.com](https://vercel.com) → **Add New → Project** → importa el repo. Vercel detecta Next.js solo.
3. En **Settings → Environment Variables** agrega:
   - `DATABASE_URL` = la URL del pooler de Supabase
   - `SITE_URL` = `https://topdechile.cl`
   - `ADMIN_TOKEN` = un token seguro (`openssl rand -hex 16`)
   - `MOCK_PAYMENTS` = `true` (hasta configurar Flow; el checkout simulado sirve para lanzar)
4. **Deploy**. Obtienes una URL tipo `el-trono.vercel.app`.

### 3. Dominio topdechile.cl (NIC Chile)

1. En [nic.cl](https://www.nic.cl) → **Mis dominios** → tu dominio → **Administrar DNS** (o Delegación).
2. Vercel te da los registros: **Settings → Domains** de tu proyecto → agrega `topdechile.cl` y `www.topdechile.cl`. Vercel muestra los valores de **A record** y **CNAME** a configurar en NIC.
3. Aplica los registros en NIC (DNS externo) y espera propagación (minutos a horas).
4. Cuando cargue `https://topdechile.cl`, Vercel emite el certificado HTTPS automático.

### 4. Pagos reales (Flow.cl)

1. Cuenta en [flow.cl](https://www.flow.cl) (sin costo mensual, comisión por transacción).
2. Panel → **Integración API** → credenciales del comercio (`apiKey`, `secret`).
3. En Vercel: `MOCK_PAYMENTS=false`, `FLOW_API_KEY=...`, `FLOW_SECRET=...`.
4. El webhook `POST /api/flow/webhook` se llama automáticamente (firma verificada).

## Reglas del juego (variables de entorno)

| Variable | Default | Qué hace |
|---|---|---|
| `STARTING_PRICE` | `1000` | Precio base del trono en un rubro vacío (~1 USD) |
| `MIN_INCREMENT` | `500` | Incremento mínimo para destronar |
| `ADMIN_TOKEN` | `eltrono-admin` | Token de `/admin` |
| `SITE_URL` | `http://localhost:3000` | URL pública (Flow, widget, SEO) |
| `DATABASE_URL` | *(vacío)* | Si está definida → Postgres/Supabase; si no → SQLite local |

## Widget embebible (para las tiendas)

```html
<script src="https://topdechile.cl/api/widget.js" data-store="mi-tienda" data-theme="dark"></script>
```

## Estructura

```
src/
  app/            páginas + API routes (Next.js App Router, SSR para SEO)
  lib/
    db.ts         adapter SQLite (dev) / Postgres (prod) con la misma API
    board.ts      lógica del juego: reclamo, destronamiento, ledger, visitas, admin
    flow.ts       integración Flow.cl (real + mock)
  components/     Board (vivo + confetti), ClaimForm, VisitorCounter, ConfirmForm
scripts/seed.mts  datos demo (funciona contra SQLite y Postgres)
supabase/schema.sql  schema + categorías para Supabase
```

## Legal

El footer y el formulario declaran que es un ranking 100% pagado (transparencia publicitaria, Ley 19.496/SERNAC). Los links a tiendas llevan `rel="sponsored nofollow"`.

## Disclaimer

MVP. Los pagos simulados no mueven plata real; prueba Flow primero en su entorno de testing.
