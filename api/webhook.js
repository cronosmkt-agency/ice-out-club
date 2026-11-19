// api/webhook.js
// Vercel Serverless Function & Express compatible Stripe Webhook
require('dotenv').config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

let stripe = null;
if (stripeSecretKey) {
  stripe = require('stripe')(stripeSecretKey);
}

// Despacho de Pedido para o Dropsimples da Camisaria Dimona
async function forwardOrderToDimona(orderData) {
  const dimonaApiKey = process.env.DIMONA_API_KEY;
  const dimonaApiUrl = process.env.DIMONA_API_URL || 'https://camisadimona.com.br/api/v1/orders';

  console.log('=== [ICE OUT CLUB] NOVO PEDIDO PAGO VIA STRIPE ===');
  console.log('ID do Pedido:', orderData.id);
  console.log('Cliente:', orderData.customer.name, `(${orderData.customer.email})`, 'Tel:', orderData.customer.phone);
  console.log('Endereço de Entrega:', orderData.shipping);
  console.log('Itens do Pedido:', JSON.stringify(orderData.items, null, 2));

  if (!dimonaApiKey) {
    console.warn('⚠️ AVISO: DIMONA_API_KEY não configurada. O pedido foi registrado com sucesso e está pronto para envio manual/planilha no painel da Dimona.');
    return { status: 'logged_offline', message: 'API key not configured' };
  }

  try {
    // Payload padronizado para a API de pedidos do Dropsimples Dimona
    const payload = {
      external_order_id: orderData.id,
      buyer: {
        name: orderData.customer.name,
        email: orderData.customer.email,
        phone: orderData.customer.phone
      },
      shipping_address: {
        recipient_name: orderData.customer.name,
        street: orderData.shipping.line1,
        complement: orderData.shipping.line2 || '',
        city: orderData.shipping.city,
        state: orderData.shipping.state,
        zipcode: orderData.shipping.postal_code,
        country: 'BR'
      },
      items: orderData.items.map(item => ({
        sku: item.sku,
        size: item.size,
        color: item.color,
        quantity: item.qty,
        print_front_url: 'https://iceoutclub.com/front_adao.png',
        print_back_url: 'https://iceoutclub.com/back_iceout.png'
      }))
    };

    const res = await fetch(dimonaApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${dimonaApiKey}`
      },
      body: JSON.stringify(payload)
    });

    const dimonaRes = await res.json().catch(() => ({}));
    console.log('Resposta Dimona Dropsimples:', res.status, dimonaRes);
    return { status: 'forwarded', dimonaRes };
  } catch (err) {
    console.error('Erro ao enviar pedido para Dimona:', err.message);
    return { status: 'error', error: err.message };
  }
}

// Helper para ler buffer cru na Vercel
function getRawBody(req) {
  return new Promise((resolve, reject) => {
    if (req.rawBody) return resolve(req.rawBody);
    if (Buffer.isBuffer(req.body)) return resolve(req.body);
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  let event;
  const sig = req.headers['stripe-signature'];

  try {
    if (endpointSecret && stripe && sig) {
      const rawBody = await getRawBody(req);
      event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    } else {
      // Modo desenvolvimento / sem secret configurado
      event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      console.warn('⚠️ Webhook executado sem validação criptográfica (STRIPE_WEBHOOK_SECRET não fornecido).');
    }
  } catch (err) {
    console.error(`Falha na validação do Webhook Stripe: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Processa o evento de checkout concluído
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    if (session.payment_status === 'paid') {
      let items = [];
      try {
        if (session.metadata && session.metadata.items_summary) {
          items = JSON.parse(session.metadata.items_summary);
        }
      } catch (e) {
        items = [];
      }

      const orderData = {
        id: session.id,
        amount_total: session.amount_total / 100,
        currency: session.currency,
        payment_status: session.payment_status,
        customer: {
          name: (session.customer_details && session.customer_details.name) || 'Cliente',
          email: (session.customer_details && session.customer_details.email) || '',
          phone: (session.customer_details && session.customer_details.phone) || ''
        },
        shipping: (session.shipping_details && session.shipping_details.address) || {},
        items: items
      };

      await forwardOrderToDimona(orderData);
    }
  }

  return res.status(200).json({ received: true });
};
