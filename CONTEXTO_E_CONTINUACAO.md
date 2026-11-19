# ICE OUT CLUB — Contexto Geral e Registro de Continuidade

Este documento serve para documentar o histórico do projeto, alterações realizadas e estado atual para que qualquer agente ou desenvolvedor possa continuar de onde paramos com total precisão.

---

## 1. Identidade e Conceito da Marca
- **Nome:** ICE OUT CLUB
- **Estilo:** Streetwear de alto padrão, visual moderno e limpo, inspirado no ecossistema da Apple / Balenciaga / Fear of God.
- **Paleta de Cores:** Fundo cinza minimalista suave (`#f4f4f7`), tipografia preta sólida, cards com cantos arredondados, efeitos de blur (`backdrop-filter`) e acabamento premium.
- **Regra de Ouro:** NENHUMA menção visual ou textual a fornecedores de estamparia externa (como Dimona) na interface do usuário. Apenas a identidade pura **ICE OUT CLUB**.

---

## 2. Modelos 3D e Peças Disponíveis
1. **Oversized Streetwear T-Shirt** (`dimona_real_oversized.gltf` / `dimona_oversized_scene.gltf`)
   - Preço: R$ 159,00
   - Tecido: 100% Algodão Penteado 260g — Gramatura Pesada & Caimento Streetwear.
   - Texturas aplicadas:
     - Frente: `front_adao.png` (Criação de Adão com mãos Michelangelo centralizadas).
     - Costas: `back_iceout.png` (Logo circular gotejante oficial ICE OUT CLUB).
2. **Moletom Blusão Prime** (`dimona_hoodie.glb`)
   - Preço: R$ 239,00
   - Tecido: Moletom Peluciado Premium 3 Cabos — Conforto Térmico & Toque Macio.
   - Deformação anatômica: Braços flexionados naturalmente a 14°, punhos acompanhando a manga e junção dos ombros hermeticamente selada (`threshold: 0.245`, `w=0.0` nos vértices de costura do tronco).
3. **Tech Streetwear T-Shirt** (`dimona_tech.glb`)
   - Preço: R$ 149,00
   - Tecido: Poliamida Nobre & Elastano — Tecnologia Anti-odor & Secagem Ultra-Rápida.
   - Decalques: Frente (`front_adao.png`) e Costas (`back_iceout.png`) posicionados corretamente no peito e costas.

---

## 3. Últimas Alterações Realizadas (Sessão Atual)

### A. Junção do Braço e Corpo do Moletom (Ombro Hermético)
- **Problema:** Existia uma pequena fresta branca visível onde a manga se juntava ao corpo do hoodie.
- **Causa Raiz:** O limiar de rotação anterior (`x > 0.20`) atingia vértices da borda da costura (que estão em $x \in [0.216, 0.240]$), separando a manga do tronco.
- **Solução Implementada:**
  - Limiar de deformação ajustado para $|x| > 0.245$:
    ```javascript
    const armDist = Math.max(0, Math.abs(x) - 0.245);
    ```
  - Vértices da costura recebem peso $w = 0.0$ e rotação $0^\circ$, mantendo-se 100% soldados ao corpo.
  - Verificado em close-up de alta resolução (`hoodie_seam_zoom_right.png` e `hoodie_seam_zoom_left.png`): gap completamente eliminado!

### B. Zoom e Enquadramento Heroico no Mobile (Idêntico à Imagem 4)
- **Problema:** No iPhone 16 e iPhone SE as peças ficavam distantes e pequenas (multiplicador 1.45). O usuário solicitou o zoom da Imagem 4, onde a peça ganha presença de streetwear (ocupando ~88% da largura da tela).
- **Solução Implementada:**
  - Multiplicador de distância da câmera no mobile ajustado para `1.08`:
    ```javascript
    targetCameraDistance = Math.max(distHeight, distWidth) * (isMobile ? 1.08 : 1.25);
    ```
  - Ponto focal vertical ajustado para `targetCenterY = isMobile ? -0.02 : -0.01`, garantindo respiro elegante de ~24px abaixo do seletor superior de categorias e estendendo a barra da peça para a parte inferior de forma impecável.

### C. Espaçamento Perfeito dos Botões de Ângulo (Frente / Costas / 360°)
- **Problema:** Os botões ficavam parcialmente cortados ou sobrepostos pelo card inferior no mobile (especialmente em telas menores como o iPhone SE).
- **Solução Implementada:**
  - Removido `bottom: 205px !important` estático.
  - Criada função reativa `updateAngleSelectorPosition()` que mede a posição real do topo do card (`card.getBoundingClientRect().top`) e posiciona a barra de ângulos a exatamente **16px de folga** acima do card:
    ```javascript
    const distFromBottom = window.innerHeight - cardRect.top;
    const targetBottom = Math.max(180, Math.round(distFromBottom + 16));
    angleWrap.style.setProperty('bottom', `${targetBottom}px`, 'important');
    ```
  - Integrado ao `ResizeObserver` monitorando `#mobile-bottom-card`, ao evento `resize`, à troca de produtos (`loadProduct`) e ao alternador de moldura iPhone.
  - Medições verificadas via CDP:
    - iPhone 16: folga de **15.6px**.
    - iPhone SE: folga de **16.3px**.

---

## 4. Estado dos Arquivos
- `3d-customizer/index.html`: Arquivo principal da aplicação atualizado e testado.
- `C:\Users\hanri\.gemini\antigravity\scratch\dimona-3d-customizer\index.html`: Cópia sincronizada.
- Servidor local rodando na porta 3000 (`http://localhost:3000/index.html`).
