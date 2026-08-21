'use client';

import { useEffect, useState } from 'react';
import { clp } from '@/lib/format';

export interface CatOpt {
  slug: string;
  name: string;
  topPrice: number | null;
  required: number;
}

export default function ClaimForm({
  cats,
  defaultCat,
  minIncrement,
}: {
  cats: CatOpt[];
  defaultCat: string;
  minIncrement: number;
}) {
  const [cat, setCat] = useState(defaultCat);
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const current = cats.find((c) => c.slug === cat) ?? cats[0];

  useEffect(() => {
    setAmount(current.required);
    setError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cat]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fd.get('name'),
          email: fd.get('email'),
          url: fd.get('url'),
          logoUrl: fd.get('logoUrl') || '',
          pitch: fd.get('pitch') || '',
          categorySlug: cat,
          amount: Number(fd.get('amount')),
        }),
      });
      const data = await res.json();
      if (data.ok) {
        window.location.href = data.redirectUrl;
      } else {
        setError(data.error || 'Algo salió mal, intenta de nuevo.');
        setLoading(false);
      }
    } catch {
      setError('No se pudo conectar. Revisa que el servidor esté corriendo.');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-6 p-6 sm:p-8">
      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="name">
            Nombre de la tienda
          </label>
          <input
            id="name"
            name="name"
            required
            maxLength={60}
            placeholder="Ej: Mi Tienda CL"
            className="input"
          />
        </div>
        <div>
          <label className="label" htmlFor="email">
            Email de contacto
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="dueño@mitienda.cl"
            className="input"
          />
        </div>
        <div>
          <label className="label" htmlFor="url">
            URL de la tienda
          </label>
          <input
            id="url"
            name="url"
            required
            placeholder="mitienda.cl"
            className="input"
          />
        </div>
        <div>
          <label className="label" htmlFor="logoUrl">
            Logo (URL de imagen, opcional)
          </label>
          <input id="logoUrl" name="logoUrl" placeholder="https://…/logo.png" className="input" />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="pitch">
          Pitch (máx. 140 caracteres, opcional)
        </label>
        <textarea
          id="pitch"
          name="pitch"
          maxLength={140}
          rows={2}
          placeholder="¿Por qué tu tienda merece el trono? (se muestra en el ranking)"
          className="input resize-none"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="cat">
            Categoría
          </label>
          <select id="cat" value={cat} onChange={(e) => setCat(e.target.value)} className="input">
            {cats.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-mut">
            {current.topPrice !== null ? (
              <>
                El trono de {current.name} hoy vale <b className="text-ink">{clp(current.topPrice)}</b>.
                Mínimo para tomarlo:{' '}
                <b className="text-ink">{clp(current.required)}</b> (trono + {clp(minIncrement)}).
              </>
            ) : (
              <>
                Nadie ha tomado el trono de {current.name} todavía. Parte en{' '}
                <b className="text-ink">{clp(current.required)}</b>.
              </>
            )}
          </p>
        </div>
        <div>
          <label className="label" htmlFor="amount">
            Tu oferta (CLP)
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            required
            min={current.required}
            step={100}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="input text-lg font-bold"
          />
          <p className="mt-2 text-xs text-mut">
            Puedes pagar más que el mínimo para dejar tu marca. Cada peso queda público en el Ledger.
          </p>
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? 'Creando orden...' : 'Tomar el trono de ' + current.name}
      </button>

      <p className="text-center text-[11px] leading-relaxed text-mut">
        Al pagar confirmas que entendiste el juego: esto es un <b>ranking pagado</b>, no editorial. Si
        alguien ofrece más, tu tienda baja un puesto. Sin reembolsos: estás comprando visibilidad
        pública en TOP DE CHILE.
      </p>
    </form>
  );
}
