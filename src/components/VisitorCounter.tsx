'use client';

import { useEffect, useState } from 'react';

/**
 * Contador de visitantes en vivo: registra la visita del usuario y
 * muestra cuántos hay en línea (últimos 5 min) y cuántos entraron en 24 h.
 */
export default function VisitorCounter() {
  const [online, setOnline] = useState<number | null>(null);
  const [last24h, setLast24h] = useState<number | null>(null);

  useEffect(() => {
    // Registra esta visita (fire-and-forget)
    fetch('/api/visit', { method: 'POST' }).catch(() => {});

    let cancelled = false;
    async function refresh() {
      try {
        const res = await fetch('/api/visits');
        const data = await res.json();
        if (!cancelled && data.ok) {
          setOnline(data.online);
          setLast24h(data.last24h);
        }
      } catch {
        /* reintenta en el próximo tick */
      }
    }
    refresh();
    const t = setInterval(refresh, 30000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  if (online === null || last24h === null) return null;

  return (
    <span className="flex flex-wrap items-center justify-center gap-2">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-1.5">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
        </span>
        <span className="font-bold text-lime">{online}</span>
        <span className="text-mut">en línea</span>
      </span>
      <span className="rounded-full border border-line px-4 py-1.5">
        <span className="font-bold text-neon">{last24h}</span>{' '}
        <span className="text-mut">visitas en 24 h</span>
      </span>
    </span>
  );
}
