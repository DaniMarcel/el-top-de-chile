import { config } from '@/lib/config';

export function GET() {
  const publisherId = config.adsenseClientId.replace(/^ca-/, '');
  if (!publisherId) {
    return new Response('AdSense no configurado.\n', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  return new Response(`google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
