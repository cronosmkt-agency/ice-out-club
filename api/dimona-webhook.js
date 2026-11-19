// api/dimona-webhook.js
// Recebe atualizações de status de produção e código de rastreio dos Correios da Dimona
require('dotenv').config();

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

  console.log('=== [DIMONA WEBHOOK] ATUALIZAÇÃO DE STATUS DE PEDIDO ===');
  console.log('Payload recebido:', JSON.stringify(payload, null, 2));

  // Exemplo de campos comuns enviados pelo Dropsimples:
  // - order_id / external_order_id
  // - status: 'in_production', 'produced', 'shipped', 'delivered'
  // - tracking_code: 'AA123456789BR'
  // - tracking_url: 'https://rastreamento.correios.com.br/...'

  return res.status(200).json({ received: true, timestamp: new Date().toISOString() });
};
