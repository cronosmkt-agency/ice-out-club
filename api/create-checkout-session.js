// api/create-checkout-session.js
// Vercel Serverless Function & Express compatible
require('dotenv').config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
let stripe = null;
if (stripeSecretKey) {
  stripe = require('stripe')(stripeSecretKey);
}

// Catálogo oficial de produtos com preços e SKUs Dimona
const PRODUCTS_CATALOG = {
  oversized: {
    name: 'Oversized Streetwear T-Shirt',
    priceInCents: 15900, // R$ 159,00
    sku: '010201010101',
    description: '100% Algodão Penteado 260g — Gramatura Pesada & Caimento Streetwear'
  },
  hoodie: {
    name: 'Moletom Blusão Prime',
    priceInCents: 23900, // R$ 239,00
    sku: '020401010108',
    description: 'Moletom Peluciado Premium 3 Cabos — Conforto Térmico & Toque Macio'
  },
  tech: {
    name: 'Tech Streetwear T-Shirt',
    priceInCents: 14900, // R$ 149,00
    sku: '010901010109',
    description: 'Poliamida Nobre & Elastano — Tecnologia Anti-odor & Secagem Ultra-Rápida'
  }
};

module.exports = async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Utilize POST.' });
  }

  try {
    if (!stripe) {
      return res.status(500).json({
        error: 'STRIPE_SECRET_KEY não foi configurada no ambiente. Adicione a chave no arquivo .env ou no painel da Vercel.'
      });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const cart = body.cart || [];

    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: 'A sacola está vazia. Adicione itens antes de prosseguir.' });
    }

    // Determina a URL base para redirecionamento
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:3000';
    const origin = body.origin || `${protocol}://${host}`;

    // Monta os line_items consultando os preços reais do catálogo (previne adulteração de preço no front)
    const lineItems = [];
    const orderItemsMeta = [];

    for (const item of cart) {
      const prodKey = (item.productKey || '').toLowerCase();
      const productInfo = PRODUCTS_CATALOG[prodKey];

      if (!productInfo) {
        return res.status(400).json({ error: `Produto inválido: ${item.productKey}` });
      }

      const quantity = Math.max(1, parseInt(item.quantity || 1, 10));
      const size = (item.size || 'G').toUpperCase();
      const colorName = item.colorName || item.color || 'Preto';

      lineItems.push({
        price_data: {
          currency: 'brl',
          unit_amount: productInfo.priceInCents,
          product_data: {
            name: `${productInfo.name} — ${size}`,
            description: `Cor: ${colorName} | SKU Dimona: ${productInfo.sku}`,
            metadata: {
              productKey: prodKey,
              sku: productInfo.sku,
              size: size,
              color: colorName
            }
          }
        },
        quantity: quantity
      });

      orderItemsMeta.push({
        key: prodKey,
        sku: productInfo.sku,
        size: size,
        color: colorName,
        qty: quantity,
        unitPrice: productInfo.priceInCents / 100
      });
    }

    // Cria a sessão de Checkout oficial na Stripe com PIX e Cartão
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'pix'],
      payment_method_options: {
        pix: {
          expires_after_seconds: 3600 // 1 hora de validade para o QR Code PIX
        }
      },
      mode: 'payment',
      line_items: lineItems,
      shipping_address_collection: {
        allowed_countries: ['BR'] // Coleta e valida endereço completo brasileiro
      },
      phone_number_collection: {
        enabled: true // Telefone do cliente obrigatório para envio e rastreio
      },
      billing_address_collection: 'required',
      success_url: `${origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/index.html`,
      metadata: {
        brand: 'ICE OUT CLUB',
        items_summary: JSON.stringify(orderItemsMeta).substring(0, 490),
        items_count: cart.length.toString(),
        created_at: new Date().toISOString()
      }
    });

    return res.status(200).json({
      id: session.id,
      url: session.url
    });

  } catch (err) {
    console.error('Erro ao criar sessão de checkout Stripe:', err);
    return res.status(500).json({
      error: err.message || 'Erro interno ao processar checkout'
    });
  }
};
