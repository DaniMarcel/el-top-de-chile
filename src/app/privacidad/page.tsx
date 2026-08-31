import type { Metadata } from 'next';
import Link from 'next/link';
import { config } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Política de privacidad',
  description: 'Cómo ¿Te alcanza? protege tus datos y utiliza medición, cookies y publicidad.',
};

export default function PrivacyPage() {
  return (
    <div className="legal-page">
      <header>
        <span className="eyebrow">Tu información</span>
        <h1>Política de privacidad</h1>
        <p>Última actualización: 30 de agosto de 2026.</p>
      </header>

      <article>
        <section>
          <h2>1. Datos de la calculadora</h2>
          <p>
            Tu sueldo, jornada y gastos se procesan dentro de tu navegador. ¿Te alcanza? no recibe,
            almacena ni asocia esos montos con una identidad. Al compartir un resultado no incluimos
            los montos individuales.
          </p>
        </section>

        <section>
          <h2>2. Datos técnicos y analítica</h2>
          <p>
            Podemos utilizar medición de audiencia para conocer visitas, dispositivos, páginas vistas
            e interacciones generales. Estos servicios pueden tratar direcciones IP, identificadores y
            datos técnicos de acuerdo con sus propias políticas y la configuración de consentimiento
            aplicable.
          </p>
        </section>

        <section>
          <h2>3. Publicidad y cookies</h2>
          <p>
            Este sitio puede mostrar publicidad de Google AdSense. Google y sus socios pueden usar
            cookies o tecnologías similares para mostrar, limitar y medir anuncios, incluso anuncios
            basados en visitas anteriores cuando la legislación y tu consentimiento lo permiten.
          </p>
          <p>
            Cuando corresponda, mostraremos una plataforma de gestión de consentimiento certificada.
            También puedes administrar la personalización publicitaria desde los controles de tu
            cuenta de Google y de tu navegador.
          </p>
        </section>

        <section>
          <h2>4. Enlaces externos y aportes</h2>
          <p>
            El botón de aporte puede llevar a un proveedor de pagos externo. Los datos entregados en
            esa plataforma son tratados por dicho proveedor y no forman parte de la calculadora.
          </p>
        </section>

        <section>
          <h2>5. Tus opciones</h2>
          <p>
            Puedes bloquear o eliminar cookies desde tu navegador y rechazar usos opcionales mediante
            el aviso de consentimiento cuando esté disponible. Bloquear publicidad no impide usar la
            calculadora.
          </p>
        </section>

        <section>
          <h2>6. Contacto</h2>
          <p>
            {config.contactEmail ? (
              <>Para consultas de privacidad, escribe a <a href={`mailto:${config.contactEmail}`}>{config.contactEmail}</a>.</>
            ) : (
              <>Habilitaremos un canal público de contacto antes del lanzamiento comercial del sitio.</>
            )}
          </p>
          <p>Consulta también nuestros <Link href="/terminos">términos de uso</Link>.</p>
        </section>
      </article>
    </div>
  );
}
