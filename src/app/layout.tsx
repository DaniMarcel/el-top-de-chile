import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { config } from '@/lib/config';

export const metadata: Metadata = {
  metadataBase: new URL(config.siteUrl),
  title: {
    default: 'EL TRONO 👑 — El ranking de tiendas de Chile que se compra',
    template: '%s · EL TRONO',
  },
  description:
    'El Top 1 de cada rubro es de quien pague más. Ranking 100% pagado y 100% transparente: cada peso está en el Ledger público. ¿Tu tienda se atreve?',
  icons: { icon: '/icon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CL">
      <body className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-50 border-b border-line bg-ink/85 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
            <Link href="/" className="flex items-center gap-2 text-lg font-black tracking-tight">
              <span className="text-2xl">👑</span>
              <span className="text-gold crown-glow">EL TRONO</span>
              <span className="hidden text-xs font-bold uppercase tracking-widest text-mut sm:inline">
                · Chile
              </span>
            </Link>
            <nav className="flex items-center gap-3 sm:gap-5 text-sm font-bold">
              <Link href="/" className="text-mut hover:text-goldsoft transition-colors">
                Ranking
              </Link>
              <Link href="/ledger" className="text-mut hover:text-goldsoft transition-colors">
                Ledger
              </Link>
              <Link
                href="/reclamar"
                className="rounded-lg bg-gold px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-ink transition-transform hover:scale-105"
              >
                Reclamar Top 1
              </Link>
            </nav>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-20">{children}</main>

        <footer className="border-t border-line py-8">
          <div className="mx-auto max-w-5xl px-4 text-center text-xs text-mut space-y-2">
            <p>
              <span className="font-bold text-goldsoft">Ranking 100% pagado.</span> Cada posición se
              compra y cada peso pagado es público en el{' '}
              <Link href="/ledger" className="underline hover:text-neon">
                Ledger
              </Link>
              . No es un ranking editorial.
            </p>
            <p>Hecho en Chile 🇨🇱 con cariño — EL TRONO 👑</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
