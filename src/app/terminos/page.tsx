import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Términos y Condiciones',
  description:
    'Términos y condiciones de uso del sitio topdechile.cl — plataforma de ranking pagado de tiendas en Chile.',
};

export default function TerminosPage() {
  return (
    <div className="pt-12 pb-8 space-y-10 max-w-3xl mx-auto">
      {/* Título */}
      <header className="space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Términos y Condiciones
        </h1>
        <p className="text-sm text-mut">
          Última actualización: 29 de agosto de 2026
        </p>
      </header>

      {/* Contenido */}
      <article className="space-y-8 text-sm leading-relaxed text-ink/80">
        {/* 1 */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-ink">
            1. Naturaleza del Sitio
          </h2>
          <p>
            <strong>topdechile.cl</strong> (en adelante, &quot;el Sitio&quot;) es
            una <strong>plataforma digital de rankings pagados</strong> que
            permite a tiendas y negocios en Chile competir por posiciones
            destacadas dentro de distintas categorías o rubros. El Sitio
            opera exclusivamente como un <strong>servicio de ranking y
            publicidad</strong>.
          </p>
          <p>
            El Sitio <strong>no confecciona, fabrica, manufactura, diseña,
            produce ni comercializa</strong> ningún tipo de producto, prenda
            de vestir, textil, ni artículo de ninguna naturaleza. No es una
            tienda, una marca de ropa ni un servicio de confección.
          </p>
        </section>

        {/* 2 */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-ink">
            2. Uso del Término &quot;Top&quot;
          </h2>
          <p>
            La palabra <strong>&quot;Top&quot;</strong> es un vocablo de la
            lengua inglesa de uso común, genérico y universal que significa
            &quot;lo más alto&quot;, &quot;lo mejor&quot; o
            &quot;parte superior&quot;. Su empleo en el nombre del Sitio hace
            referencia exclusivamente a su significado descriptivo:
            <strong> clasificar, ordenar y rankear</strong> elementos de mayor
            a menor importancia.
          </p>
          <p>
            El uso del término &quot;Top&quot; en el contexto de este Sitio
            es <strong>puramente descriptivo y genérico</strong>, y no busca
            asociarse, confundirse ni competir con ninguna marca registrada,
            razón social o nombre comercial de terceros que contenga dicho
            vocablo. En particular, el Sitio <strong>no tiene ninguna
            relación, directa ni indirecta</strong>, con empresas del rubro
            de confecciones, textiles o moda que utilicen la palabra
            &quot;Top&quot; en su denominación.
          </p>
          <p>
            La expresión &quot;Top de Chile&quot; describe literalmente el
            propósito del Sitio: presentar un <strong>ranking de los
            mejores</strong> en distintas categorías, mediante un sistema
            transparente y público de pujas pagadas.
          </p>
        </section>

        {/* 3 */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-ink">
            3. Servicios Ofrecidos
          </h2>
          <p>El Sitio ofrece los siguientes servicios:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Ranking pagado:</strong> las tiendas pueden pagar para
              obtener posiciones destacadas en categorías específicas.
            </li>
            <li>
              <strong>Ledger público:</strong> un registro transparente de
              todas las transacciones realizadas.
            </li>
            <li>
              <strong>Perfiles de tienda:</strong> cada tienda participante
              cuenta con un perfil verificado dentro del Sitio.
            </li>
          </ul>
          <p>
            Estos servicios son de naturaleza{' '}
            <strong>publicitaria y de clasificación</strong>, y en ningún
            caso involucran la fabricación, confección o venta de productos
            físicos.
          </p>
        </section>

        {/* 4 */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-ink">
            4. Propiedad Intelectual
          </h2>
          <p>
            Todo el contenido del Sitio, incluyendo pero no limitado a
            textos, gráficos, logotipos, íconos, código fuente y diseño, es
            propiedad de los titulares de topdechile.cl o se utiliza bajo
            licencia legítima. Queda prohibida su reproducción sin
            autorización expresa.
          </p>
          <p>
            El nombre &quot;Top de Chile&quot; se utiliza en su sentido
            descriptivo y genérico. El Sitio no reivindica derechos
            exclusivos sobre el término &quot;Top&quot; como vocablo
            aislado, reconociendo su carácter genérico y de uso común en el
            idioma español e inglés.
          </p>
        </section>

        {/* 5 */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-ink">
            5. Responsabilidad
          </h2>
          <p>
            El Sitio actúa como intermediario de publicidad mediante
            rankings. No garantiza la calidad, veracidad ni legitimidad de
            los productos o servicios de las tiendas que participan en el
            ranking. Cada tienda es responsable de sus propias ofertas y
            representaciones.
          </p>
          <p>
            El Sitio no se hace responsable de disputas comerciales entre
            los usuarios y las tiendas listadas.
          </p>
        </section>

        {/* 6 */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-ink">
            6. Pagos y Reembolsos
          </h2>
          <p>
            Los pagos realizados para adquirir posiciones en el ranking son{' '}
            <strong>definitivos y no reembolsables</strong>, salvo en los
            casos excepcionales contemplados por la ley chilena vigente.
            Todos los pagos quedan registrados públicamente en el{' '}
            <Link
              href="/ledger"
              className="text-accent font-medium underline hover:text-accent-dark transition-colors"
            >
              Ledger
            </Link>
            .
          </p>
        </section>

        {/* 7 */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-ink">
            7. Modificaciones
          </h2>
          <p>
            El Sitio se reserva el derecho de modificar estos Términos y
            Condiciones en cualquier momento. Las modificaciones serán
            efectivas desde su publicación en esta página. El uso continuado
            del Sitio tras la publicación de cambios constituye aceptación
            de los mismos.
          </p>
        </section>

        {/* 8 */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-ink">
            8. Legislación Aplicable
          </h2>
          <p>
            Estos Términos y Condiciones se rigen por las leyes de la
            República de Chile. Para la resolución de cualquier controversia
            derivada del uso del Sitio, las partes se someten a la
            jurisdicción de los tribunales ordinarios de justicia de Chile.
          </p>
        </section>

        {/* 9 */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-ink">
            9. Contacto
          </h2>
          <p>
            Para cualquier consulta relacionada con estos Términos y
            Condiciones, puede escribirnos a través de los canales de
            contacto disponibles en el Sitio.
          </p>
        </section>
      </article>

      {/* CTA volver */}
      <div className="pt-4 border-t border-line">
        <Link
          href="/"
          className="text-sm font-medium text-accent hover:underline transition-colors"
        >
          ← Volver al ranking
        </Link>
      </div>
    </div>
  );
}
