import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import './globals.css';
import { config } from '@/lib/config';

export const metadata: Metadata = {
  metadataBase: new URL(config.siteUrl),
  title: {
    default: 'TOP DE CHILE — El ranking de tiendas de Chile que se compra',
    template: '%s · TOP DE CHILE',
  },
  description:
    'El Top 1 de cada rubro es de quien pague más. Ranking 100% pagado y transparente de las mejores tiendas de Chile.',
  keywords: [
    'top tiendas Chile',
    'mejores tiendas Chile',
    'ranking tiendas Chile',
    'top empresas Chile',
    'mejores empresas Chile',
    'tiendas online Chile',
    'ranking empresas Chile',
    'top de Chile',
    'suplementos Chile',
    'sneakers Chile',
    'ropa Chile',
    'tecnología Chile',
    'café Chile',
    'belleza Chile',
    'mascotas Chile',
    'gaming Chile',
  ],
  icons: { icon: '/icon.svg' },
  openGraph: {
    type: 'website',
    locale: 'es_CL',
    siteName: 'TOP DE CHILE',
    title: 'TOP DE CHILE — El ranking de tiendas de Chile que se compra',
    description:
      'El Top 1 de cada rubro es de quien pague más. Ranking pagado y transparente de las mejores tiendas online de Chile.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TOP DE CHILE — El ranking que se compra',
    description:
      'El Top 1 de cada rubro es de quien pague más. ¿Tu tienda se atreve?',
  },
  alternates: {
    canonical: config.siteUrl,
  },
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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-9VMHF6S0DV"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-9VMHF6S0DV');
          `}
        </Script>
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
            <p className="text-mut/50">
              Hecho en Chile 🇨🇱 — TOP DE CHILE ·{' '}
              <Link href="/terminos" className="underline hover:text-ink transition-colors">
                Términos y Condiciones
              </Link>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
