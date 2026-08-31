import type { Metadata } from 'next';
import Link from 'next/link';
import { config } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Términos de uso',
  description: 'Condiciones de uso de la calculadora gratuita ¿Te alcanza?.',
};

export default function TermsPage() {
  return (
    <div className="legal-page">
      <header>
        <span className="eyebrow">Información legal</span>
        <h1>Términos de uso</h1>
        <p>Última actualización: 30 de agosto de 2026.</p>
      </header>

      <article>
        <section>
          <h2>1. Naturaleza de la herramienta</h2>
          <p>
            ¿Te alcanza? es una calculadora gratuita con fines informativos y educativos. Sus
            resultados son estimaciones construidas a partir de la información que cada usuario
            introduce y de los supuestos publicados en la <Link href="/metodologia">metodología</Link>.
          </p>
        </section>

        <section>
          <h2>2. No es asesoría financiera</h2>
          <p>
            El contenido no constituye asesoría financiera, tributaria, contable, laboral ni legal.
            No garantizamos que una decisión basada en el resultado sea adecuada para tus circunstancias.
          </p>
        </section>

        <section>
          <h2>3. Disponibilidad y exactitud</h2>
          <p>
            Procuramos mantener la herramienta disponible y sus fórmulas correctamente explicadas,
            pero no garantizamos continuidad ininterrumpida ni ausencia total de errores. Podemos
            modificar funciones y supuestos para mejorar el servicio.
          </p>
        </section>

        <section>
          <h2>4. Publicidad y enlaces externos</h2>
          <p>
            El sitio puede financiarse mediante anuncios y aportes voluntarios. Los anuncios no son
            recomendaciones nuestras. Los sitios externos operan bajo sus propios términos y políticas.
          </p>
        </section>

        <section>
          <h2>5. Uso permitido</h2>
          <p>
            Puedes usar y compartir la herramienta para fines personales. No puedes interferir con su
            funcionamiento, automatizar tráfico publicitario, suplantar el sitio ni reutilizar su marca
            de manera que induzca a confusión.
          </p>
        </section>

        <section>
          <h2>6. Privacidad y contacto</h2>
          <p>
            El tratamiento de datos técnicos y publicitarios se explica en la{' '}
            <Link href="/privacidad">política de privacidad</Link>.
          </p>
          {config.contactEmail ? <p>Contacto: <a href={`mailto:${config.contactEmail}`}>{config.contactEmail}</a>.</p> : null}
        </section>
      </article>
    </div>
  );
}
