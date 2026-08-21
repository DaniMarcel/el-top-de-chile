export const config = {
  siteUrl: (process.env.SITE_URL || 'http://localhost:3000').replace(/\/$/, ''),
  startingPrice: Number(process.env.STARTING_PRICE || 1000),
  minIncrement: Number(process.env.MIN_INCREMENT || 500),
  adminToken: process.env.ADMIN_TOKEN || 'eltrono-admin',
  mockPayments:
    process.env.MOCK_PAYMENTS === 'true' ||
    !(process.env.FLOW_API_KEY && process.env.FLOW_SECRET),
  flowApiKey: process.env.FLOW_API_KEY || '',
  flowSecret: process.env.FLOW_SECRET || '',
};
