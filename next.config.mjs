/** @type {import('next').NextConfig} */
const nextConfig = {
  // node:sqlite es un builtin de Node, no requiere config especial.
  // NOTA: sin `output: 'standalone'` — Vercel no lo soporta (rompe el build con ENOENT .nft.json).
  async redirects() {
    return [
      { source: '/ledger', destination: '/', permanent: true },
      { source: '/reclamar', destination: '/', permanent: true },
      { source: '/categoria/:path*', destination: '/', permanent: true },
      { source: '/tienda/:path*', destination: '/', permanent: true },
    ];
  },
};

export default nextConfig;
