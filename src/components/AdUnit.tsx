'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

export default function AdUnit({ slot, className = '' }: { slot?: string; className?: string }) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const initialized = useRef(false);

  useEffect(() => {
    if (!client || !slot || initialized.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      initialized.current = true;
    } catch {
      // Ad blockers may prevent the AdSense runtime from loading.
    }
  }, [client, slot]);

  if (!client || !slot) return null;

  return (
    <aside className={`ad-space ${className}`.trim()} aria-label="Publicidad">
      <span>Publicidad</span>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
