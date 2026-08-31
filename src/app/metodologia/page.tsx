import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Metodología de la calculadora',
  description:
    'Conoce las fórmulas y supuestos que usa ¿Te alcanza? para estimar cuándo se acaba tu sueldo y cuánto vale una hora de trabajo.',
};

export default function MethodologyPage() {
  return (
    <div className="legal-page">
      <header>
        <span className="eyebrow">Transparencia</span>
        <h1>Cómo hacemos el cálculo</h1>
        <p>Fórmulas simples, supuestos visibles y ninguna caja negra.</p>
      </header>

      <article>
        <section>
          <h2>1. El día en que se termina el sueldo</h2>
          <p>
            Consideramos que el sueldo está disponible al inicio del mes y que los gastos fijos se
            pagan primero. Los gastos variables se distribuyen uniformemente durante un mes estándar
            de 30 días.
          </p>
          <p>
            La fórmula es: <strong>(sueldo − gastos fijos) ÷ (gastos variables ÷ 30)</strong>. Si tus
            gastos totales no superan tu sueldo, informamos que llegas a fin de mes.
          </p>
        </section>

        <section>
          <h2>2. El valor de una hora de trabajo</h2>
          <p>
            Estimamos las horas mensuales multiplicando tu jornada semanal por 52 semanas y dividiendo
            el resultado por 12 meses. Luego dividimos tu sueldo líquido entre esas horas.
          </p>
          <p>
            La fórmula es: <strong>sueldo líquido ÷ (horas semanales × 52 ÷ 12)</strong>. No agregamos
            horas de traslado, colación ni trabajo doméstico no remunerado.
          </p>
        </section>

        <section>
          <h2>3. Las horas que cuesta cada gasto</h2>
          <p>
            Dividimos el monto de cada categoría por el valor estimado de tu hora. Es una equivalencia
            educativa: no significa que puedas dejar de trabajar exactamente esas horas ni reemplaza
            el análisis de un contrato laboral.
          </p>
        </section>

        <section>
          <h2>4. Límites del resultado</h2>
          <ul>
            <li>Los meses reales tienen distinta cantidad de días.</li>
            <li>Los gastos variables no ocurren necesariamente de manera uniforme.</li>
            <li>No calculamos impuestos, inflación, intereses ni rentabilidad.</li>
            <li>El resultado depende completamente de los montos ingresados por cada persona.</li>
          </ul>
          <p>Por esas razones, el resultado es una estimación y no constituye asesoría financiera.</p>
        </section>

        <section>
          <h2>5. Privacidad del cálculo</h2>
          <p>
            Los montos ingresados se procesan localmente en el navegador. No se envían ni se guardan
            en nuestra base de datos. Puedes revisar más detalles en nuestra{' '}
            <Link href="/privacidad">política de privacidad</Link>.
          </p>
        </section>
      </article>
    </div>
  );
}
