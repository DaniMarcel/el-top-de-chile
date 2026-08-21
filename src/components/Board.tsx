'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import Link from 'next/link';
import { clp, timeAgo } from '@/lib/format';

export interface BoardStore {
  id: number;
  slug: string;
  name: string;
  url: string;
  logo_url: string;
  pitch: string;
  position: number | null;
  current_price: number | null;
  verified: number;
  claimed_at: string | null;
}

interface Props {
  catSlug: string;
  catName: string;
  initial: BoardStore[];
  topPrice: number | null;
  required: number;
}

function fireConfetti() {
  const colors = ['#dc2626', '#ca8a04', '#2563eb', '#16a34a'];
  confetti({ particleCount: 130, spread: 85, origin: { y: 0.3 }, colors, zIndex: 9999 });
  setTimeout(
    () => confetti({ particleCount: 80, angle: 60, spread: 60, origin: { x: 0 }, colors, zIndex: 9999 }),
    250
  );
  setTimeout(
    () => confetti({ particleCount: 80, angle: 120, spread: 60, origin: { x: 1 }, colors, zIndex: 9999 }),
    450
  );
}

export default function Board({ catSlug, catName, initial, topPrice, required }: Props) {
  const [stores, setStores] = useState<BoardStore[]>(initial);
  const [price, setPrice] = useState<number | null>(topPrice);
  const [banner, setBanner] = useState<string | null>(null);
  const kingRef = useRef<number | null>(initial[0]?.id ?? null);
  const firstRun = useRef(true);

  useEffect(() => {
    if (!banner) return;
    const t = setTimeout(() => setBanner(null), 7000);
    return () => clearTimeout(t);
  }, [banner]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const king = params.get('king');
    if (king) {
      setBanner(decodeURIComponent(king) + ' acaba de tomar el trono de ' + catName);
      fireConfetti();
      params.delete('king');
      params.delete('cat');
      const qs = params.toString();
      window.history.replaceState(null, '', qs ? '?' + qs : window.location.pathname);
    }

    const poll = setInterval(async () => {
      try {
        const res = await fetch(`/api/board?cat=${catSlug}`);
        const data = await res.json();
        const newKing = data.stores[0]?.id ?? null;
        if (
          !firstRun.current &&
          newKing !== null &&
          kingRef.current !== null &&
          newKing !== kingRef.current
        ) {
          setBanner('Nuevo rey: ' + data.stores[0].name + ' destronó al rey de ' + catName);
          fireConfetti();
        }
        firstRun.current = false;
        kingRef.current = newKing;
        setStores(data.stores);
        setPrice(data.topPrice);
      } catch {
        /* el siguiente poll lo reintenta */
      }
    }, 15000);
    return () => clearInterval(poll);
  }, [catSlug, catName]);

  return (
    <div className="space-y-4">
      {banner && (
        <div className="animate-kingpop card border-gold bg-gold-bg px-5 py-4 text-center font-bold text-ink">
          👑 {banner}
        </div>
      )}

      {/* Throne value */}
      <div className="card flex flex-col items-center justify-between gap-4 overflow-hidden sm:flex-row">
        <div className="w-full border-b border-line bg-card2 px-6 py-5 sm:w-auto sm:flex-1 sm:border-b-0 sm:border-r">
          <p className="text-xs font-medium uppercase tracking-wide text-mut">
            El trono de {catName} hoy vale
          </p>
          <p className="mt-1 text-4xl font-extrabold sm:text-5xl">
            {clp(price ?? 0)}
          </p>
        </div>
        <div className="px-6 pb-5 sm:pb-0 sm:pr-6">
          <Link href={'/reclamar?cat=' + catSlug} className="btn-primary whitespace-nowrap">
            Tomar el trono · {clp(required)}
          </Link>
        </div>
      </div>

      {/* Ranking list */}
      <div className="card divide-y divide-line overflow-hidden">
        {stores.length === 0 && (
          <p className="px-6 py-10 text-center text-mut">
            Nadie ha reclamado el trono todavía. ¿Te lo llevas?
          </p>
        )}
        {stores.map((s) => (
          <div
            key={s.id}
            className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-card2"
          >
            <div
              className={
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ' +
                (s.position === 1
                  ? 'bg-gold-bg text-gold border border-gold/30'
                  : 'bg-card2 text-mut border border-line')
              }
            >
              {s.position === 1 ? '👑' : s.position}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={'/tienda/' + s.slug}
                  className="truncate font-semibold hover:text-accent transition-colors"
                >
                  {s.name}
                </Link>
                {!!s.verified && (
                  <span className="badge-verified">Verificada</span>
                )}
              </div>
              {s.pitch && (
                <p className="hidden truncate text-sm text-mut sm:block">{s.pitch}</p>
              )}
            </div>

            <div className="shrink-0 text-right">
              <p className="font-bold">
                {clp(s.current_price ?? 0)}
              </p>
              <p className="text-xs text-mut">{s.claimed_at ? timeAgo(s.claimed_at) : ''}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
