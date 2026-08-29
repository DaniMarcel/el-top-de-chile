import type { MetadataRoute } from 'next';
import { getAllStores, getCategories } from '@/lib/board';
import { config } from '@/lib/config';

// El sitemap consulta la DB: debe generarse en runtime, no en build
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cats, stores] = await Promise.all([getCategories(), getAllStores()]);
  const now = new Date();
  const d = (s: string | null) => (s ? new Date(s.replace(' ', 'T') + 'Z') : now);

  return [
    { url: config.siteUrl, lastModified: now },
    { url: config.siteUrl + '/ledger', lastModified: now },
    { url: config.siteUrl + '/reclamar', lastModified: now },
    { url: config.siteUrl + '/terminos', lastModified: now },
    ...cats.map((c) => ({
      url: config.siteUrl + '/categoria/' + c.slug,
      lastModified: now,
    })),
    ...stores.map((s) => ({
      url: config.siteUrl + '/tienda/' + s.slug,
      lastModified: d(s.claimed_at),
    })),
  ];
}
