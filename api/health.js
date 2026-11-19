// api/health.js
require('dotenv').config();

module.exports = function handler(req, res) {
  const hasStripeKey = Boolean(process.env.STRIPE_SECRET_KEY);
  const hasDimonaKey = Boolean(process.env.DIMONA_API_KEY);
  const hasWebhookSecret = Boolean(process.env.STRIPE_WEBHOOK_SECRET);

  res.status(200).json({
    status: 'online',
    brand: 'ICE OUT CLUB',
    environment: process.env.NODE_ENV || 'development',
    config: {
      stripe: hasStripeKey ? 'configured' : 'missing_key',
      stripe_webhook: hasWebhookSecret ? 'configured' : 'missing_key',
      dimona: hasDimonaKey ? 'configured' : 'offline_mode'
    },
    timestamp: new Date().toISOString()
  });
};
