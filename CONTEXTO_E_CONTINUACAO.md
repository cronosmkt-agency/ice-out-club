# ICE OUT CLUB — Contexto Geral e Registro de Continuidade

Este documento serve para documentar o histórico do projeto, alterações realizadas e estado atual para que qualquer agente ou desenvolvedor possa continuar de onde paramos com total precisão.

---

## 1. Identidade e Conceito da Marca
- **Nome:** ICE OUT CLUB
- **Domínio Oficial de Produção:** [https://iceoutclub.shop](https://iceoutclub.shop) (com redirecionamento automático de `www.iceoutclub.shop`)
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

## 3. SEO, Favicon e Compartilhamento Social (WhatsApp, Twitter, Google)
- **Banner de Compartilhamento Open Graph:** `https://iceoutclub.shop/og_banner.jpg` (1200x630, proporção padrão 1.91:1 com a peça 3D iluminada e tipografia da marca).
- **Favicons Multi-Resolução:**
  - `favicon.ico` (16x16, 32x32, 48x48)
  - `favicon-32x32.png` & `favicon-16x16.png`
  - `apple-touch-icon.png` (180x180 squircle escuro de alto contraste)
  - `android-chrome-192x192.png` & `android-chrome-512x512.png`
  - `site.webmanifest` com suporte a Progressive Web App (PWA)
- **Meta Tags de Busca & Redes:**
  - Título: `ICE OUT CLUB — Official Streetwear Store`
  - Descrição: `Streetwear de alta gramatura, caimento oversized exclusivo e experiência 3D interativa. Camisetas e moletons premium com entrega para todo o Brasil.`
  - Schema.org (`ClothingStore` com catálogo de ofertas em BRL para o Google Search).

---

## 4. Arquitetura de Pagamentos & Produção
- **Stripe:** Checkout oficial em BRL com **PIX instantâneo** e **Cartão**, validação de endereço brasileiro completo e webhook ativo.
- **Dimona Dropsimples:** Integração via API e webhook (`/api/dimona-webhook`) configurada para despacho automático sob demanda.
- **Hospedagem & Deploy:** Repositório GitHub `cronosmkt-agency/ice-out-club` conectado à Vercel com deploy contínuo em `https://iceoutclub.shop`.
