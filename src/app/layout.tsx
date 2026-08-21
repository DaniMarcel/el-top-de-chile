import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { config } from '@/lib/config';

export const metadata: Metadata = {
  metadataBase: new URL(config.siteUrl),
  title: {
    default: 'TOP DE CHILE — El ranking de tiendas que se compra',
    template: '%s · TOP DE CHILE',
  },
  description:
    'El Top 1 de cada rubro es de quien pague más. Ranking 100% pagado y transparente: cada peso está en el Ledger público.',
  icons: { icon: '/icon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CL">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-50 border-b border-line bg-white/80 backdrop-blur-lg">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
            <Link href="/" className="font-extrabold text-lg tracking-tight text-ink">
              TOP DE CHILE
            </Link>
            <nav className="flex items-center gap-1 sm:gap-4 text-sm font-medium">
              <Link href="/" className="px-2 py-1 text-mut hover:text-ink transition-colors">
                Ranking
              </Link>
              <Link href="/ledger" className="px-2 py-1 text-mut hover:text-ink transition-colors">
                Ledger
              </Link>
              <Link
                href="/reclamar"
                className="btn-primary !px-4 !py-2 !text-sm !rounded-lg"
              >
                Reclamar Top 1
              </Link>
            </nav>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-20">{children}</main>

        <footer className="border-t border-line bg-card2 py-8">
          <div className="mx-auto max-w-5xl px-4 text-center text-xs text-mut space-y-1.5">
            <p>
              <span className="font-semibold text-ink">Ranking 100% pagado.</span>{' '}
              Cada posición se compra y cada peso pagado es público en el{' '}
              <Link href="/ledger" className="underline hover:text-ink transition-colors">
                Ledger
              </Link>
              . No es un ranking editorial.
            </p>
            <p className="text-mut/50">Hecho en Chile 🇨🇱 — TOP DE CHILE</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
