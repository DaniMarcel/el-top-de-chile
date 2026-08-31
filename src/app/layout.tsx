import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import './globals.css';
import { config } from '@/lib/config';

export const metadata: Metadata = {
  metadataBase: new URL(config.siteUrl),
  title: {
    default: '¿Te alcanza? — Calculadora de sueldo y gastos en Chile',
    template: '%s · ¿Te alcanza?',
  },
  description:
    'Descubre hasta qué día te alcanza el sueldo, cuánto valen tus horas de trabajo y qué porcentaje se va en gastos. Calculadora chilena gratuita y anónima.',
  keywords: [
    'calculadora de presupuesto Chile',
    'hasta qué día alcanza el sueldo',
    'calculadora de gastos mensuales',
    'cuánto vale mi hora de trabajo Chile',
    'cómo llegar a fin de mes',
    'sueldo y costo de vida Chile',
  ],
  applicationName: '¿Te alcanza?',
  category: 'finance',
  authors: [{ name: '¿Te alcanza?' }],
  creator: '¿Te alcanza?',
  publisher: '¿Te alcanza?',
  other: {
    'google-adsense-account': config.adsenseClientId,
  },
  icons: { icon: '/icon.svg' },
  alternates: { canonical: config.siteUrl },
  openGraph: {
    type: 'website',
    locale: 'es_CL',
    siteName: '¿Te alcanza?',
    title: '¿Te alcanza? — Descubre cuándo se termina tu sueldo',
    description:
      'Calcula hasta qué día te alcanza el sueldo y cuántas horas de tu vida cuestan tus gastos.',
    url: config.siteUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: '¿Te alcanza?',
    description: 'Descubre cuándo se termina tu sueldo. Gratis, anónimo y sin juzgarte.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CL">
      <head>
        {config.adsenseClientId ? (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.adsenseClientId}`}
            crossOrigin="anonymous"
          />
        ) : null}
      </head>
      <body>
        {config.gaMeasurementId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${config.gaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${config.gaMeasurementId}', { anonymize_ip: true });
              `}
            </Script>
          </>
        ) : null}

        <header className="site-header">
          <div className="header-inner">
            <Link href="/" className="brand" aria-label="¿Te alcanza? Inicio">
              <span className="brand-mark" aria-hidden="true">$</span>
              <span>¿Te alcanza?</span>
            </Link>
            <nav aria-label="Navegación principal">
              <Link href="/#como-funciona">Cómo funciona</Link>
              <Link href="/#preguntas">Preguntas</Link>
              <Link href="/#apoyar" className="nav-support">Apoyar</Link>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="site-footer">
          <div className="footer-inner">
            <div>
              <Link href="/" className="brand footer-brand">
                <span className="brand-mark" aria-hidden="true">$</span>
                <span>¿Te alcanza?</span>
              </Link>
              <p>Una fotografía simple de tu mes. Hecho en Chile.</p>
            </div>
            <nav aria-label="Información legal">
              <Link href="/metodologia">Metodología</Link>
              <Link href="/privacidad">Privacidad</Link>
              <Link href="/terminos">Términos</Link>
            </nav>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} ¿Te alcanza?</span>
            <span>Herramienta educativa; no constituye asesoría financiera.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
