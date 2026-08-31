import AdUnit from '@/components/AdUnit';
import BudgetCalculator from '@/components/BudgetCalculator';
import { config } from '@/lib/config';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '¿Te alcanza?',
  url: config.siteUrl,
  description:
    'Calculadora gratuita para descubrir hasta qué día te alcanza el sueldo y cuántas horas de trabajo cuestan tus gastos en Chile.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Cualquier dispositivo con navegador web',
  inLanguage: 'es-CL',
  isAccessibleForFree: true,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'CLP',
  },
};

export default function Home() {
  const donationUrl = config.donationUrl;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      <section className="hero-section">
        <div className="hero-copy">
          <span className="hero-kicker"><i /> Hecho para bolsillos chilenos</span>
          <h1>
            ¿Hasta qué día
            <span>te alcanza?</span>
          </h1>
          <p>
            Descubre cuándo se termina tu sueldo y cuántas horas de tu vida cuestan tus gastos.
            Gratis, anónimo y sin juzgarte.
          </p>
          <a className="hero-cta" href="#calculadora">
            Hacer el cálculo <span aria-hidden="true">↓</span>
          </a>
          <div className="hero-proof" aria-label="Características">
            <span>Sin registro</span>
            <span>No guardamos tus datos</span>
            <span>Resultado al instante</span>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="month-card">
            <div className="month-topline">
              <span>AGOSTO</span>
              <span>SUELDO</span>
            </div>
            <div className="month-day">23</div>
            <div className="month-caption">Hasta aquí llegamos</div>
            <div className="month-progress"><span /></div>
          </div>
          <div className="floating-note note-hours">
            <span>Vivienda</span>
            <strong>72 horas</strong>
            <small>de trabajo</small>
          </div>
          <div className="floating-note note-spend">
            <span>Gastos</span>
            <strong>84%</strong>
            <small>de tu sueldo</small>
          </div>
          <div className="scribble">¿y tú?</div>
        </div>
      </section>

      <AdUnit slot={config.adsenseTopSlot} className="ad-top" />

      <section className="calculator-intro">
        <span className="section-number">01</span>
        <div>
          <span className="eyebrow">La calculadora</span>
          <h2>Pon tus números sobre la mesa.</h2>
        </div>
        <p>No necesitas ser experto en finanzas. Usa montos aproximados y nosotros hacemos el resto.</p>
      </section>

      <BudgetCalculator />

      <section className="explanation-section" id="como-funciona">
        <div className="section-title-row">
          <span className="section-number">02</span>
          <div>
            <span className="eyebrow">Sin letra chica</span>
            <h2>¿Qué estamos calculando?</h2>
          </div>
        </div>

        <div className="explanation-grid">
          <article>
            <span className="article-icon">30</span>
            <h3>El día en que se acaba</h3>
            <p>
              Descontamos primero tus gastos fijos y distribuimos los variables en un mes de 30 días.
              Así estimamos cuándo tu saldo llega a cero.
            </p>
          </article>
          <article>
            <span className="article-icon">$ / h</span>
            <h3>El valor de tu hora</h3>
            <p>
              Convertimos tu sueldo mensual en valor por hora usando tus horas semanales. Luego
              mostramos cuántas horas trabajas para financiar cada gasto.
            </p>
          </article>
          <article>
            <span className="article-icon">%</span>
            <h3>El peso de tus gastos</h3>
            <p>
              Comparamos todo lo que gastas con tu ingreso líquido. El resultado es una fotografía
              simple de tu mes, no una recomendación financiera.
            </p>
          </article>
        </div>

        <a className="method-link" href="/metodologia">
          Ver fórmula y metodología completa <span aria-hidden="true">→</span>
        </a>
      </section>

      <AdUnit slot={config.adsenseInlineSlot} className="ad-inline" />

      <section className="answer-section" id="preguntas">
        <div className="section-title-row">
          <span className="section-number">03</span>
          <div>
            <span className="eyebrow">Respuestas claras</span>
            <h2>Preguntas que todos nos hacemos</h2>
          </div>
        </div>

        <div className="faq-list">
          <details>
            <summary>¿Cuánto de mi sueldo debería destinar a gastos?</summary>
            <p>
              No existe un porcentaje universal: depende de tus ingresos, ciudad, hogar y deudas.
              Como referencia práctica, primero identifica gastos esenciales, deudas y ahorro; el
              saldo restante define cuánto puedes destinar a gastos flexibles.
            </p>
          </details>
          <details>
            <summary>¿Cómo sé cuánto vale una hora de mi trabajo?</summary>
            <p>
              Divide tu sueldo líquido por las horas que trabajas al mes. Esta calculadora estima
              las horas mensuales multiplicando tu jornada semanal por 52 y dividiendo por 12.
            </p>
          </details>
          <details>
            <summary>¿Guardan mi sueldo o mis gastos?</summary>
            <p>
              No. Los cálculos ocurren dentro de tu navegador y los montos no se envían a nuestro
              servidor. Si compartes el resultado, solo se incluyen el día y los porcentajes.
            </p>
          </details>
          <details>
            <summary>¿Esto reemplaza una asesoría financiera?</summary>
            <p>
              No. Es una herramienta educativa para entender mejor tu presupuesto. No considera
              impuestos, rentabilidad, riesgo ni circunstancias personales completas.
            </p>
          </details>
        </div>
      </section>

      <section className="support-section" id="apoyar">
        <div>
          <span className="support-sticker">100% independiente</span>
          <h2>Si te sirvió, ayúdanos a mantenerlo gratuito.</h2>
          <p>
            Tu aporte paga servidores, mejoras y nuevas herramientas para entender mejor el costo de
            vivir en Chile.
          </p>
        </div>
        {donationUrl ? (
          <a className="support-button" href={donationUrl} target="_blank" rel="noopener noreferrer">
            <span aria-hidden="true">☕</span> Invítanos un café
          </a>
        ) : (
          <span className="support-button support-button-disabled" title="Configura NEXT_PUBLIC_DONATION_URL">
            <span aria-hidden="true">☕</span> Aportes próximamente
          </span>
        )}
      </section>
    </>
  );
}
