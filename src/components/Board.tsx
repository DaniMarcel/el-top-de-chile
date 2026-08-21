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

const RANK_STYLE = [
  '',
  'border-gold text-gold bg-gold/10 shadow-[0_0_18px_rgba(245,197,66,0.25)]',
  'border-slate-300/60 text-slate-200 bg-slate-300/5',
  'border-amber-700 text-amber-600 bg-amber-700/10',
];

function fireConfetti() {
  const colors = ['#f5c542', '#22d3ee', '#e879f9', '#a3e635'];
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
      setBanner('\u{1F451} ' + decodeURIComponent(king) + ' acaba de tomar el trono de ' + catName + '!');
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
          setBanner('\u{1F451} NUEVO REY: ' + data.stores[0].name + ' destronó al rey de ' + catName);
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
        <div className="animate-kingpop card border-gold bg-gold/10 px-5 py-4 text-center text-lg font-black text-goldsoft">
          {banner}
        </div>
      )}

      <div className="card animate-pulsegold flex flex-col items-center justify-between gap-4 border-gold/60 bg-gradient-to-br from-gold/10 via-panel to-panel px-6 py-6 sm:flex-row">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-mut">
            El trono de {catName} hoy vale
          </p>
          <p className="crown-glow mt-1 text-4xl font-black text-gold sm:text-5xl">
            {clp(price ?? 0)}
          </p>
        </div>
        <Link href={'/reclamar?cat=' + catSlug} className="btn-claim">
          👑 Tomar el trono · {clp(required)}
        </Link>
      </div>

      <div className="card divide-y divide-line overflow-hidden">
        {stores.length === 0 && (
          <p className="px-6 py-10 text-center text-mut">
            Nadie ha reclamado el trono todavía. ¿Te lo llevas?
          </p>
        )}
        {stores.map((s) => (
          <div
            key={s.id}
            className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-panel2"
          >
            <div
              className={
                'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-lg font-black ' +
                (RANK_STYLE[s.position ?? 0] || 'border-line text-mut')
              }
            >
              {s.position === 1 ? '👑' : s.position}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Link href={'/tienda/' + s.slug} className="truncate font-bold hover:text-goldsoft transition-colors">
                  {s.name}
                </Link>
                {!!s.verified && (
                  <span className="rounded-full border border-lime/40 bg-lime/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-lime">
                    ✓ verificada
                  </span>
                )}
              </div>
              {s.pitch && (
                <p className="hidden truncate text-sm text-mut sm:block">{s.pitch}</p>
              )}
            </div>

            <div className="shrink-0 text-right">
              <p className="font-black text-goldsoft">
                {clp(s.current_price ?? 0)}
                <span className="ml-1 text-[10px] font-bold uppercase text-mut">pagó</span>
              </p>
              <p className="text-xs text-mut">{s.claimed_at ? timeAgo(s.claimed_at) : ''}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
