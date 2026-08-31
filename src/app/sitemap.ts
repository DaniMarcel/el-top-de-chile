import type { MetadataRoute } from 'next';
import { config } from '@/lib/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: config.siteUrl, lastModified, changeFrequency: 'monthly', priority: 1 },
    { url: `${config.siteUrl}/metodologia`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${config.siteUrl}/privacidad`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${config.siteUrl}/terminos`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
