function validUrl(s: string | undefined, fallback: string): string {
  if (!s) return fallback;
  try {
    const u = new URL(s);
    return u.origin ? u.toString().replace(/\/$/, '') : fallback;
  } catch {
    return fallback;
  }
}

const rawSiteUrl = validUrl(process.env.SITE_URL, 'http://localhost:3000');
// El ID de publisher es público por diseño: AdSense lo expone en el HTML y en ads.txt.
const adsensePublisherId = 'ca-pub-1927993980009423';

export const config = {
  siteUrl: rawSiteUrl,
  siteName: '¿Te alcanza?',
  adsenseClientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || adsensePublisherId,
  adsenseTopSlot: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP || '',
  adsenseInlineSlot: process.env.NEXT_PUBLIC_ADSENSE_SLOT_INLINE || '',
  donationUrl: process.env.NEXT_PUBLIC_DONATION_URL || '',
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '',
  contactEmail: process.env.CONTACT_EMAIL || '',
  startingPrice: Number(process.env.STARTING_PRICE || 1000),
  minIncrement: Number(process.env.MIN_INCREMENT || 500),
  adminToken: process.env.ADMIN_TOKEN || 'eltrono-admin',
  mockPayments:
    process.env.MOCK_PAYMENTS === 'true' ||
    !(process.env.FLOW_API_KEY && process.env.FLOW_SECRET),
  flowApiKey: process.env.FLOW_API_KEY || '',
  flowSecret: process.env.FLOW_SECRET || '',
};
