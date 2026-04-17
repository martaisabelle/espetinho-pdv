/**
 * cardapio.js — "API interna" do cardápio
 *
 * Fonte única de verdade para os itens à venda.
 * Isolado para facilitar futura edição pelo dono do negócio
 * (ou migração para um endpoint /api/cardapio).
 *
 * Estrutura de cada item:
 * {
 *   id:        string   — identificador único slug
 *   emoji:     string   — ícone visual rápido
 *   nome:      string   — nome padronizado
 *   preco:     number   — preço unitário em R$
 *   categoria: string   — 'espeto' | 'bebida' | 'combo' | 'acomp'
 * }
 */

const Cardapio = (() => {

  const itens = [
    // ── ESPETINHOS ──────────────────────────────────────────
    { id: 'frango',          emoji: '🍗', nome: 'Espetinho de frango',              preco:  8.50, categoria: 'espeto' },
    { id: 'carne',           emoji: '🥩', nome: 'Espetinho de carne',               preco: 10.00, categoria: 'espeto' },
    { id: 'linguica',        emoji: '🌭', nome: 'Espetinho de linguiça',             preco:  9.00, categoria: 'espeto' },
    { id: 'queijo',          emoji: '🧀', nome: 'Espetinho de queijo',              preco:  7.00, categoria: 'espeto' },
    { id: 'misto',           emoji: '🍢', nome: 'Espetinho misto (linguiça+queijo)', preco: 11.00, categoria: 'espeto' },
    { id: 'coracaoPinto',    emoji: '❤️', nome: 'Coração de frango',               preco:  7.50, categoria: 'espeto' },

    // ── BEBIDAS ──────────────────────────────────────────────
    { id: 'refriLata',       emoji: '🥤', nome: 'Refrigerante lata',                preco:  5.00, categoria: 'bebida' },
    { id: 'cocaLata',        emoji: '🥤', nome: 'Coca-Cola lata',                   preco:  5.50, categoria: 'bebida' },
    { id: 'guaranaLata',     emoji: '🥤', nome: 'Guaraná lata',                     preco:  5.00, categoria: 'bebida' },
    { id: 'sucoLaranja',     emoji: '🍊', nome: 'Suco de laranja',                  preco:  6.00, categoria: 'bebida' },
    { id: 'cerveja',         emoji: '🍺', nome: 'Cerveja lata 350ml',               preco:  7.00, categoria: 'bebida' },
    { id: 'agua',            emoji: '💧', nome: 'Água mineral',                     preco:  3.00, categoria: 'bebida' },

    // ── ACOMPANHAMENTOS ──────────────────────────────────────
    { id: 'farofa',          emoji: '🫙', nome: 'Farofa',                           preco:  3.00, categoria: 'acomp' },
    { id: 'vinagrete',       emoji: '🥗', nome: 'Vinagrete',                        preco:  3.00, categoria: 'acomp' },
    { id: 'pao',             emoji: '🍞', nome: 'Pão de alho',                      preco:  4.00, categoria: 'acomp' },

    // ── COMBOS ───────────────────────────────────────────────
    { id: 'combo1',          emoji: '🎯', nome: 'Combo 1 (3 frango + Coca)',        preco: 28.00, categoria: 'combo' },
    { id: 'combo2',          emoji: '🎯', nome: 'Combo 2 (2 linguiça + cerveja)',   preco: 22.00, categoria: 'combo' },
    { id: 'combo3',          emoji: '🎯', nome: 'Combo família (6 espetos + 2 refri)', preco: 55.00, categoria: 'combo' },
  ];

  /** Busca por parte do nome (case-insensitive, ignora acentos) */
  function buscarPorNome(parte) {
    const term = _normalizar(parte || '');
    if (!term) return [];
    return itens.filter(item => _normalizar(item.nome).includes(term));
  }

  /** Retorna item por id */
  function pegarPorId(id) {
    return itens.find(item => item.id === id) || null;
  }

  /** Retorna todos os itens (cópia) */
  function getListaCompleta() {
    return itens.slice();
  }

  /** Retorna itens de uma categoria */
  function getPorCategoria(categoria) {
    return itens.filter(item => item.categoria === categoria);
  }

  /** Normaliza string: lowercase + remove acentos */
  function _normalizar(str) {
    return str.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  return { buscarPorNome, pegarPorId, getListaCompleta, getPorCategoria };
})();
