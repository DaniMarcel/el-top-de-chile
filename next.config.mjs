/** @type {import('next').NextConfig} */
const nextConfig = {
  // node:sqlite es un builtin de Node, no requiere config especial.
  // NOTA: sin `output: 'standalone'` — Vercel no lo soporta (rompe el build con ENOENT .nft.json).
};

export default nextConfig;
