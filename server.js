// server.js
// Servidor de desenvolvimento local e suporte para Vercel
require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para processar Webhook com Buffer Cru
app.post('/api/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  req.rawBody = req.body;
  const webhookHandler = require('./api/webhook.js');
  return webhookHandler(req, res);
});

// Middleware padrão para JSON nos demais endpoints
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoints da API
app.all('/api/create-checkout-session', (req, res) => {
  const handler = require('./api/create-checkout-session.js');
  return handler(req, res);
});

app.all('/api/health', (req, res) => {
  const handler = require('./api/health.js');
  return handler(req, res);
});

app.all('/api/dimona-webhook', (req, res) => {
  const handler = require('./api/dimona-webhook.js');
  return handler(req, res);
});

// Servir arquivos estáticos do Customizador 3D
app.use(express.static(path.join(__dirname, '3d-customizer')));

// Fallback para index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '3d-customizer', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🧊 [ICE OUT CLUB] Servidor ativo em: http://localhost:${PORT}`);
  console.log(`💳 Stripe Checkout API: http://localhost:${PORT}/api/create-checkout-session`);
  console.log(`🔔 Stripe Webhook: http://localhost:${PORT}/api/webhook`);
  console.log(`🩺 Health Check: http://localhost:${PORT}/api/health`);
});
