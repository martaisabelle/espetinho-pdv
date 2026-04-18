/**
 * cardapio.js — "API interna" do cardápio
 * Usa chaves de ícones (Icons.*) em vez de emojis.
 */

const Cardapio = (() => {

  const itens = [
    // ── ESPETINHOS
    { id: 'frango',       icon: 'chicken', nome: 'Espetinho de frango',               preco:  8.50, categoria: 'espeto' },
    { id: 'carne',        icon: 'meat',    nome: 'Espetinho de carne',                preco: 10.00, categoria: 'espeto' },
    { id: 'linguica',     icon: 'sausage', nome: 'Espetinho de linguiça',             preco:  9.00, categoria: 'espeto' },
    { id: 'queijo',       icon: 'cheese',  nome: 'Espetinho de queijo',               preco:  7.00, categoria: 'espeto' },
    { id: 'misto',        icon: 'skewer',  nome: 'Espetinho misto',                   preco: 11.00, categoria: 'espeto' },
    { id: 'coracao',      icon: 'heart',   nome: 'Coração de frango',                 preco:  7.50, categoria: 'espeto' },

    // ── BEBIDAS
    { id: 'refriLata',    icon: 'can',     nome: 'Refrigerante lata',                 preco:  5.00, categoria: 'bebida' },
    { id: 'cocaLata',     icon: 'can',     nome: 'Coca-Cola lata',                    preco:  5.50, categoria: 'bebida' },
    { id: 'guaranaLata',  icon: 'can',     nome: 'Guaraná lata',                      preco:  5.00, categoria: 'bebida' },
    { id: 'sucoLaranja',  icon: 'juice',   nome: 'Suco de laranja',                   preco:  6.00, categoria: 'bebida' },
    { id: 'cerveja',      icon: 'can',     nome: 'Cerveja 350ml',                     preco:  7.00, categoria: 'bebida' },
    { id: 'agua',         icon: 'water',   nome: 'Água mineral',                      preco:  3.00, categoria: 'bebida' },

    // ── ACOMPANHAMENTOS
    { id: 'farofa',       icon: 'jar',     nome: 'Farofa',                            preco:  3.00, categoria: 'acomp' },
    { id: 'vinagrete',    icon: 'salad',   nome: 'Vinagrete',                         preco:  3.00, categoria: 'acomp' },
    { id: 'pao',          icon: 'bread',   nome: 'Pão de alho',                       preco:  4.00, categoria: 'acomp' },

    // ── COMBOS
    { id: 'combo1',       icon: 'box',     nome: 'Combo 1 — 3 frango + Coca',        preco: 28.00, categoria: 'combo' },
    { id: 'combo2',       icon: 'box',     nome: 'Combo 2 — 2 linguiça + cerveja',   preco: 22.00, categoria: 'combo' },
    { id: 'combo3',       icon: 'star',    nome: 'Combo família — 6 espetos + 2 refri', preco: 55.00, categoria: 'combo' },
  ];

  function buscarPorNome(parte) {
    const term = _norm(parte || '');
    if (!term) return [];
    return itens.filter(i => _norm(i.nome).includes(term));
  }

  function pegarPorId(id) {
    return itens.find(i => i.id === id) || null;
  }

  function getListaCompleta() { return itens.slice(); }

  function getPorCategoria(cat) {
    return itens.filter(i => i.categoria === cat);
  }

  function _norm(s) {
    return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  return { buscarPorNome, pegarPorId, getListaCompleta, getPorCategoria };
})();
