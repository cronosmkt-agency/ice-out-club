# ICE OUT CLUB — Contexto Geral e Registro de Continuidade

Este documento serve para documentar o histórico do projeto, alterações realizadas e estado atual para que qualquer agente ou desenvolvedor possa continuar de onde paramos com total precisão.

---

## 1. Identidade e Conceito da Marca
- **Nome:** ICE OUT CLUB
- **Estilo:** Streetwear de alto padrão, visual moderno e limpo, inspirado no ecossistema da Apple / Balenciaga / Fear of God.
- **Paleta de Cores:** Fundo cinza minimalista suave (`#f4f4f7`), tipografia preta sólida, cards com cantos arredondados, efeitos de blur (`backdrop-filter`) e acabamento premium.
- **Regra de Ouro:** NENHUMA menção visual ou textual a fornecedores de estamparia externa na interface do usuário. Apenas a identidade pura **ICE OUT CLUB**.

---

## 2. Modelos 3D e Peças Disponíveis
1. **Oversized Streetwear T-Shirt** (`dimona_real_oversized.gltf`)
   - Preço: R$ 159,00 | SKU Dimona: `010201010101`
   - Tecido: 100% Algodão Penteado 260g — Gramatura Pesada & Caimento Streetwear.
2. **Moletom Blusão Prime** (`dimona_hoodie.glb`)
   - Preço: R$ 239,00 | SKU Dimona: `020401010108`
   - Tecido: Moletom Peluciado Premium 3 Cabos — Conforto Térmico & Toque Macio.
   - Deformação anatômica: Braços flexionados naturalmente a 14°, punhos acompanhando a manga e ombros 100% soldados e contínuos (`threshold: 0.245`).
3. **Tech Streetwear T-Shirt** (`dimona_tech.glb`)
   - Preço: R$ 149,00 | SKU Dimona: `010901010109`
   - Tecido: Poliamida Nobre & Elastano — Tecnologia Anti-odor & Secagem Ultra-Rápida.

---

## 3. Arquitetura de Pagamentos & Deploy (Stripe + Dimona + Vercel)
- **Gateway:** Stripe Checkout com suporte nativo a **PIX** (com QR Code instantâneo e expiração de 1h) e **Cartão de Crédito** em até 12x, com validação de endereço brasileiro completo e telefone do comprador.
- **Backend Serverless (Vercel):**
  - `api/create-checkout-session.js`: Cria a sessão oficial na Stripe a partir do carrinho, blindando os preços contra adulteração no cliente.
  - `api/webhook.js`: Recebe a notificação de pagamento confirmado (`checkout.session.completed`), valida a assinatura criptográfica e encaminha os dados do pedido (cliente, endereço e SKUs) para o **Dropsimples da Dimona**.
  - `api/health.js`: Endpoint para monitoramento da saúde da API e status das chaves configuradas.
- **Página de Confirmação:** `3d-customizer/success.html` no padrão visual streetwear da marca.
- **Servidor Local Híbrido:** `server.js` em Node.js/Express servindo a aplicação completa na porta 3000.
- **Configuração Vercel:** `vercel.json` com roteamento automático de `/api/*` e `/3d-customizer/*`.
- **Controle de Versão:** Repositório Git inicializado na branch `main` com `.gitignore` limpo e primeiro commit criado.

---

## 4. O que o Usuário Precisa Fornecer / Configurar
1. **Stripe:**
   - `STRIPE_SECRET_KEY` (`sk_test_...` ou `sk_live_...`)
   - `STRIPE_PUBLISHABLE_KEY` (`pk_test_...` ou `pk_live_...`)
   - `STRIPE_WEBHOOK_SECRET` (`whsec_...`)
   - Ativação do **Pix** no painel da Stripe.
2. **Dimona:**
   - `DIMONA_API_KEY` (obtida no painel de lojista em camisadimona.com.br).
3. **Deploy:**
   - Criar repositório no GitHub e vincular na Vercel com as variáveis de ambiente.
