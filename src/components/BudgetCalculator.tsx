'use client';

import { FormEvent, useMemo, useRef, useState } from 'react';

type Budget = {
  salary: number;
  weeklyHours: number;
  housing: number;
  bills: number;
  debt: number;
  food: number;
  transport: number;
  leisure: number;
  other: number;
};

type Result = {
  total: number;
  balance: number;
  expenseRatio: number;
  hourlyIncome: number;
  lifeHours: number;
  housingHours: number;
  day: number;
  reachesMonthEnd: boolean;
};

const initialBudget: Budget = {
  salary: 1000000,
  weeklyHours: 44,
  housing: 350000,
  bills: 110000,
  debt: 0,
  food: 220000,
  transport: 80000,
  leisure: 60000,
  other: 40000,
};

const money = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
});

const number = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 1 });

function CurrencyField({
  id,
  label,
  value,
  onChange,
}: {
  id: keyof Budget;
  label: string;
  value: number;
  onChange: (key: keyof Budget, value: number) => void;
}) {
  return (
    <label className="budget-field" htmlFor={id}>
      <span>{label}</span>
      <span className="money-input">
        <span aria-hidden="true">$</span>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min="0"
          step="1000"
          value={value || ''}
          placeholder="0"
          onChange={(event) => onChange(id, Math.max(0, Number(event.target.value) || 0))}
        />
      </span>
    </label>
  );
}

function calculate(budget: Budget): Result {
  const fixed = budget.housing + budget.bills + budget.debt;
  const variable = budget.food + budget.transport + budget.leisure + budget.other;
  const total = fixed + variable;
  const balance = budget.salary - total;
  const monthlyHours = Math.max(1, budget.weeklyHours) * (52 / 12);
  const hourlyIncome = budget.salary / monthlyHours;

  let day = 30;
  if (balance < 0) {
    if (fixed >= budget.salary || variable === 0) {
      day = 1;
    } else {
      day = Math.max(1, Math.min(29, Math.floor((budget.salary - fixed) / (variable / 30))));
    }
  }

  return {
    total,
    balance,
    expenseRatio: budget.salary > 0 ? (total / budget.salary) * 100 : 0,
    hourlyIncome,
    lifeHours: hourlyIncome > 0 ? total / hourlyIncome : 0,
    housingHours: hourlyIncome > 0 ? budget.housing / hourlyIncome : 0,
    day,
    reachesMonthEnd: balance >= 0,
  };
}

export default function BudgetCalculator() {
  const [budget, setBudget] = useState(initialBudget);
  const [result, setResult] = useState<Result | null>(null);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(
    () => [
      { label: 'Vivienda', value: budget.housing, color: '#ff5c35' },
      { label: 'Cuentas', value: budget.bills, color: '#ffad32' },
      { label: 'Deudas', value: budget.debt, color: '#8e75ff' },
      { label: 'Comida', value: budget.food, color: '#19a974' },
      { label: 'Transporte', value: budget.transport, color: '#2d8cff' },
      { label: 'Ocio y otros', value: budget.leisure + budget.other, color: '#ea4c89' },
    ],
    [budget]
  );

  function update(key: keyof Budget, value: number) {
    setBudget((current) => ({ ...current, [key]: value }));
    setResult(null);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (budget.salary <= 0 || budget.weeklyHours <= 0) return;
    setResult(calculate(budget));
    setCopied(false);
    window.setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
  }

  async function share() {
    if (!result) return;
    const headline = result.reachesMonthEnd
      ? `A mí sí me alcanza para llegar a fin de mes.`
      : `A mí el sueldo me alcanza hasta el día ${result.day}.`;
    const text = `${headline} El ${Math.round(result.expenseRatio)}% de mis ingresos se va en gastos. ¿Y a ti?`;
    const shareData = { title: '¿Te alcanza?', text, url: window.location.origin };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${text} ${window.location.origin}`);
        setCopied(true);
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
    }
  }

  return (
    <div className="calculator-shell" id="calculadora">
      <form className="calculator-form" onSubmit={submit}>
        <div className="form-heading">
          <span className="eyebrow">Tus números</span>
          <h2>Cuéntanos cómo se va tu mes</h2>
          <p>Todo se calcula en tu dispositivo. No guardamos tus ingresos ni tus gastos.</p>
        </div>

        <div className="salary-row">
          <CurrencyField id="salary" label="Sueldo líquido mensual" value={budget.salary} onChange={update} />
          <label className="budget-field" htmlFor="weeklyHours">
            <span>Horas de trabajo por semana</span>
            <span className="hours-input">
              <input
                id="weeklyHours"
                type="number"
                inputMode="numeric"
                min="1"
                max="100"
                value={budget.weeklyHours || ''}
                onChange={(event) => update('weeklyHours', Math.max(0, Number(event.target.value) || 0))}
              />
              <span>horas</span>
            </span>
          </label>
        </div>

        <fieldset>
          <legend>Gastos fijos del mes</legend>
          <div className="field-grid">
            <CurrencyField id="housing" label="Arriendo o dividendo" value={budget.housing} onChange={update} />
            <CurrencyField id="bills" label="Cuentas y servicios" value={budget.bills} onChange={update} />
            <CurrencyField id="debt" label="Cuotas y deudas" value={budget.debt} onChange={update} />
          </div>
        </fieldset>

        <fieldset>
          <legend>Gastos variables del mes</legend>
          <div className="field-grid field-grid-four">
            <CurrencyField id="food" label="Comida" value={budget.food} onChange={update} />
            <CurrencyField id="transport" label="Transporte" value={budget.transport} onChange={update} />
            <CurrencyField id="leisure" label="Ocio" value={budget.leisure} onChange={update} />
            <CurrencyField id="other" label="Otros" value={budget.other} onChange={update} />
          </div>
        </fieldset>

        <button className="calculate-button" type="submit" disabled={budget.salary <= 0 || budget.weeklyHours <= 0}>
          Calcular si me alcanza
          <span aria-hidden="true">→</span>
        </button>
      </form>

      <div className={`result-card ${result ? 'result-ready' : ''}`} ref={resultRef} aria-live="polite">
        {!result ? (
          <div className="result-placeholder">
            <div className="result-orbit" aria-hidden="true">
              <span>30</span>
            </div>
            <span className="eyebrow">Tu resultado</span>
            <h2>¿Llegas al 30?</h2>
            <p>Completa tus gastos para descubrir hasta qué día te acompaña el sueldo.</p>
            <div className="privacy-pill">Sin registro · 100% anónimo</div>
          </div>
        ) : (
          <div className="result-content">
            <span className="eyebrow eyebrow-light">Tu resultado</span>
            <div className="day-result">
              {result.reachesMonthEnd ? (
                <>
                  <strong>✓</strong>
                  <h2>Llegas a fin de mes</h2>
                </>
              ) : (
                <>
                  <span>Tu sueldo llega hasta el</span>
                  <strong>{result.day}</strong>
                  <span>de cada mes</span>
                </>
              )}
            </div>

            <p className="result-summary">
              Gastas <b>{money.format(result.total)}</b>, equivalente al{' '}
              <b>{number.format(result.expenseRatio)}%</b> de tu sueldo.
            </p>

            <div className="result-stats">
              <div>
                <span>Saldo mensual</span>
                <strong className={result.balance < 0 ? 'negative' : ''}>{money.format(result.balance)}</strong>
              </div>
              <div>
                <span>Tu hora vale</span>
                <strong>{money.format(result.hourlyIncome)}</strong>
              </div>
              <div>
                <span>Horas para pagar tus gastos</span>
                <strong>{number.format(result.lifeHours)} h</strong>
              </div>
              <div>
                <span>Solo para vivienda</span>
                <strong>{number.format(result.housingHours)} h</strong>
              </div>
            </div>

            <div className="expense-bars" aria-label="Distribución de gastos">
              {categories.filter((category) => category.value > 0).map((category) => (
                <div className="expense-row" key={category.label}>
                  <div>
                    <span>{category.label}</span>
                    <b>{money.format(category.value)}</b>
                  </div>
                  <span className="bar-track">
                    <span
                      className="bar-fill"
                      style={{
                        width: `${Math.min(100, (category.value / Math.max(1, result.total)) * 100)}%`,
                        background: category.color,
                      }}
                    />
                  </span>
                </div>
              ))}
            </div>

            <button className="share-button" type="button" onClick={share}>
              <span aria-hidden="true">↗</span>
              {copied ? 'Resultado copiado' : 'Compartir mi resultado'}
            </button>
            <p className="share-note">Solo compartimos porcentajes y el día, nunca tus montos.</p>
          </div>
        )}
      </div>
    </div>
  );
}
