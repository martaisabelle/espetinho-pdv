/**
 * icons.js — Biblioteca de ícones SVG customizados
 * Todos desenhados do zero. Stroke-based, linha fina, estilo profissional.
 * Paleta: variáveis CSS para compatibilidade com temas.
 */

const Icons = {

  /* ── UI GERAL ─────────────────────────────────────────── */

  sun: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="4.5"/>
    <line x1="12" y1="2" x2="12" y2="4.5"/>
    <line x1="12" y1="19.5" x2="12" y2="22"/>
    <line x1="4.22" y1="4.22" x2="5.93" y2="5.93"/>
    <line x1="18.07" y1="18.07" x2="19.78" y2="19.78"/>
    <line x1="2" y1="12" x2="4.5" y2="12"/>
    <line x1="19.5" y1="12" x2="22" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.93" y2="18.07"/>
    <line x1="18.07" y1="5.93" x2="19.78" y2="4.22"/>
  </svg>`,

  moon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/>
  </svg>`,

  close: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>`,

  check: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>`,

  plus: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>`,

  trash: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/>
    <path d="M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>`,

  clipboard: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
    <line x1="9" y1="12" x2="15" y2="12"/>
    <line x1="9" y1="16" x2="13" y2="16"/>
  </svg>`,

  checkCircle: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>`,

  search: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="11" cy="11" r="7"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>`,

  receipt: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1V2l-2 1-2-1-2 1-2-1-2 1-2-1z"/>
    <line x1="8" y1="8" x2="16" y2="8"/>
    <line x1="8" y1="12" x2="14" y2="12"/>
    <line x1="8" y1="16" x2="12" y2="16"/>
  </svg>`,

  chartBar: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6"  y1="20" x2="6"  y2="14"/>
    <line x1="2"  y1="20" x2="22" y2="20"/>
  </svg>`,

  /* ── COMIDAS / CARDÁPIO ───────────────────────────────── */

  // Espetinho no palito
  skewer: `<svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <line x1="4" y1="28" x2="28" y2="4" stroke-width="1.4"/>
    <rect x="11" y="9" width="6" height="5" rx="2.5" transform="rotate(45 14 11.5)"/>
    <rect x="16" y="14" width="6" height="5" rx="2.5" transform="rotate(45 19 16.5)"/>
    <rect x="6"  y="19" width="6" height="5" rx="2.5" transform="rotate(45 9 21.5)"/>
    <circle cx="26" cy="6" r="1.8" fill="currentColor" stroke="none"/>
  </svg>`,

  // Peça de carne / bife
  meat: `<svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M6 20 C4 17 4 11 8 9 C11 7 15 8 17 6 C20 4 25 5 27 9 C29 13 27 18 24 20 C21 22 10 24 6 20Z"/>
    <path d="M11 13 C13 11 17 12 19 14"/>
    <circle cx="22" cy="11" r="1.5" fill="currentColor" stroke="none"/>
  </svg>`,

  // Linguiça
  sausage: `<svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M6 22 C4 18 5 12 9 10 C13 8 18 10 22 9 C26 8 28 11 27 15 C26 19 23 22 19 23 C14 24 8 26 6 22Z"/>
    <path d="M10 14 Q16 12 22 15"/>
    <path d="M8 18 Q14 17 20 19"/>
  </svg>`,

  // Queijo (fatia triangular)
  cheese: `<svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 24 L16 8 L28 24 Z"/>
    <line x1="4" y1="24" x2="28" y2="24"/>
    <circle cx="12" cy="20" r="1.5" fill="currentColor" stroke="none"/>
    <circle cx="20" cy="17" r="1.2" fill="currentColor" stroke="none"/>
    <circle cx="17" cy="22" r="1" fill="currentColor" stroke="none"/>
  </svg>`,

  // Frango (coxa)
  chicken: `<svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M8 26 C8 26 6 22 8 18 C10 14 14 13 16 10 C18 7 20 5 23 6 C26 7 27 10 25 13 C23 16 20 16 18 19 C16 22 16 26 14 26 Z"/>
    <line x1="8" y1="26" x2="14" y2="26"/>
    <path d="M23 6 C25 4 27 4 27 6"/>
  </svg>`,

  // Coração (coração de frango)
  heart: `<svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M16 26 C16 26 5 19 5 12 C5 8 8 6 11 6 C13 6 15 7 16 9 C17 7 19 6 21 6 C24 6 27 8 27 12 C27 19 16 26 16 26Z"/>
    <line x1="16" y1="26" x2="16" y2="18" stroke-width="1.2"/>
  </svg>`,

  // Lata (refrigerante / cerveja)
  can: `<svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <rect x="9" y="8" width="14" height="18" rx="4"/>
    <ellipse cx="16" cy="8" rx="7" ry="2.5"/>
    <ellipse cx="16" cy="26" rx="7" ry="2.5"/>
    <line x1="13" y1="6" x2="13" y2="8"/>
    <path d="M13 6 Q16 4 19 6"/>
    <line x1="10" y1="13" x2="22" y2="13" stroke-width="0.9" stroke-dasharray="2 2"/>
  </svg>`,

  // Copo de suco
  juice: `<svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M8 8 L10 26 L22 26 L24 8 Z"/>
    <line x1="8" y1="8" x2="24" y2="8"/>
    <path d="M10 16 Q16 14 22 16" stroke-width="1" stroke-dasharray="2 1.5"/>
    <circle cx="16" cy="20" r="1.2" fill="currentColor" stroke="none"/>
    <path d="M16 8 L16 5 Q19 3 21 5" stroke-width="1.4"/>
  </svg>`,

  // Garrafa de água
  water: `<svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M13 4 L13 7 C10 8 9 10 9 12 L9 24 C9 25.1 9.9 26 11 26 L21 26 C22.1 26 23 25.1 23 24 L23 12 C23 10 22 8 19 7 L19 4 Z"/>
    <line x1="13" y1="4" x2="19" y2="4"/>
    <rect x="13" y="3" width="6" height="2" rx="1"/>
    <path d="M11 18 Q16 16 21 18" stroke-width="1" stroke-dasharray="2 1.5"/>
  </svg>`,

  // Pão
  bread: `<svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M6 14 C6 10 9 8 12 8 C13 8 14 8.5 14 8.5 C14 8.5 14 8 16 8 C18 8 18 8.5 18 8.5 C18 8.5 19 8 20 8 C23 8 26 10 26 14 L26 24 L6 24 Z"/>
    <line x1="6" y1="24" x2="26" y2="24"/>
    <path d="M10 14 Q12 12 14 14 Q16 16 18 14 Q20 12 22 14" stroke-width="1.2"/>
  </svg>`,

  // Farofa / pote
  jar: `<svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <rect x="10" y="12" width="12" height="14" rx="2"/>
    <path d="M8 12 C8 10 10 9 12 9 L20 9 C22 9 24 10 24 12 Z"/>
    <rect x="11" y="7" width="10" height="3" rx="1.5"/>
    <line x1="12" y1="17" x2="20" y2="17" stroke-width="1" stroke-dasharray="1.5 2"/>
    <line x1="12" y1="21" x2="18" y2="21" stroke-width="1" stroke-dasharray="1.5 2"/>
  </svg>`,

  // Salada / vinagrete
  salad: `<svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M7 18 C7 14 9 10 13 9 C15 8 17 9 17 9 C17 9 19 8 21 9 C25 10 26 14 25 18 Z"/>
    <path d="M6 18 L26 18 L24 26 L8 26 Z"/>
    <path d="M10 13 Q12 11 14 13"/>
    <path d="M18 12 Q20 10 22 12"/>
    <circle cx="16" cy="22" r="1.2" fill="currentColor" stroke="none"/>
  </svg>`,

  // Caixa / combo
  box: `<svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 10 L16 4 L28 10 L28 22 L16 28 L4 22 Z"/>
    <line x1="4"  y1="10" x2="28" y2="10"/>
    <line x1="16" y1="4"  x2="16" y2="28"/>
    <line x1="4"  y1="10" x2="16" y2="16"/>
    <line x1="28" y1="10" x2="16" y2="16"/>
    <line x1="16" y1="16" x2="16" y2="28"/>
  </svg>`,

  // Estrela (destaque)
  star: `<svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="16,4 19.6,12.4 28.8,13 22.4,19 24.4,28 16,23.2 7.6,28 9.6,19 3.2,13 12.4,12.4"/>
  </svg>`,

  // Logo espetinho (no header)
  logo: `<svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <line x1="5" y1="27" x2="27" y2="5" stroke-width="1.5"/>
    <rect x="12.5" y="7.5" width="7" height="5.5" rx="3" transform="rotate(45 16 10.25)" fill="none"/>
    <rect x="17"   y="12"  width="7" height="5.5" rx="3" transform="rotate(45 20.5 14.75)" fill="none"/>
    <rect x="7.5"  y="17"  width="7" height="5.5" rx="3" transform="rotate(45 11 19.75)" fill="none"/>
    <circle cx="27" cy="5" r="2" fill="currentColor" stroke="none"/>
    <circle cx="5"  cy="27" r="1.4" fill="currentColor" stroke="none"/>
  </svg>`,

};

/**
 * Retorna o SVG inline de um ícone.
 * @param {string} name — chave do ícone
 * @param {object} opts — { size, class, color }
 */
Icons.get = function(name, opts = {}) {
  let svg = Icons[name] || Icons.close;
  if (opts.size) {
    svg = svg.replace(/width="\d+"/, `width="${opts.size}"`).replace(/height="\d+"/, `height="${opts.size}"`);
  }
  if (opts.class) {
    svg = svg.replace('<svg ', `<svg class="${opts.class}" `);
  }
  if (opts.color) {
    svg = svg.replace(/stroke="currentColor"/g, `stroke="${opts.color}"`);
  }
  return svg;
};
