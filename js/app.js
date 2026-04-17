/**
 * app.js — Lógica de negócio principal
 *
 * Coordena: Storage ↔ Cardapio ↔ UI
 *
 * Estado local do formulário:
 * _itensPedido: Array de { id, emoji, nome, preco, qtd }
 * (mantido em memória enquanto o pedido está sendo montado)
 *
 * Para migração ao backend:
 * → substitua Storage.* por fetch('/api/pedidos', ...)
 * → _itensPedido pode virar body de um POST
 */

const app = (() => {

  /* ─── ESTADO DO FORMULÁRIO ───────────────────────────────── */

  // Itens selecionados do cardápio para o pedido atual
  let _itensPedido = [];

  /* ─── INICIALIZAÇÃO ──────────────────────────────────────── */

  function init() {
    // Aplica tema salvo
    ui.initTheme();

    // Carrega pedidos salvos
    const pedidos = Storage.listar();
    ui.renderizarPedidos(pedidos);

    // Inicia cardápio (grid + autocomplete)
    ui.initCardapio();

    // Atalho Enter no campo de valor
    document.getElementById('inputValor').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') criarPedido();
    });

    // Ao abrir aba "novo" no mobile, foca o primeiro campo
    const tabNovo = document.querySelector('[data-tab="novo"]');
    if (tabNovo) {
      tabNovo.addEventListener('click', () => {
        setTimeout(() => document.getElementById('inputCliente').focus(), 80);
      });
    }

    console.log('[App] Iniciado. Pedidos:', pedidos.length);
  }

  /* ─── CARDÁPIO: ADICIONAR ITEM AO RASCUNHO ───────────────── */

  /**
   * Chamado pelo ui.confirmarItem() após o modal de quantidade.
   * @param {Object} item    — item do cardápio
   * @param {number} qtd     — quantidade selecionada
   */
  function adicionarItemAoPedido(item, qtd) {
    // Se o item já existe, acumula a quantidade
    const existente = _itensPedido.find(e => e.id === item.id);
    if (existente) {
      existente.qtd += qtd;
    } else {
      _itensPedido.push({
        id:    item.id,
        emoji: item.emoji,
        nome:  item.nome,
        preco: item.preco,
        qtd:   qtd,
      });
    }

    // Atualiza a UI com os itens e o valor calculado
    ui.renderizarItensAdicionados(_itensPedido);
  }

  /**
   * Remove um item da lista pelo índice.
   * @param {number} idx
   */
  function removerItemDoPedido(idx) {
    _itensPedido.splice(idx, 1);
    ui.renderizarItensAdicionados(_itensPedido);
  }

  /** Limpa todos os itens do rascunho */
  function limparItensPedido() {
    _itensPedido = [];
    ui.renderizarItensAdicionados(_itensPedido);
    document.getElementById('inputValor').value = '';
  }

  /* ─── CRIAR PEDIDO ───────────────────────────────────────── */

  function criarPedido() {
    const cliente  = document.getElementById('inputCliente').value.trim();
    const obsTexto = document.getElementById('inputItens').value.trim();
    const valorRaw = document.getElementById('inputValor').value;
    const valor    = parseFloat(valorRaw);

    // Monta o texto de itens: cardápio estruturado + observação livre
    const linhasCardapio = _itensPedido.map(e =>
      `${e.qtd}× ${e.emoji} ${e.nome} (${ui.formatarDinheiro(e.qtd * e.preco)})`
    );
    const todosItens = [
      ...linhasCardapio,
      ...(obsTexto ? [obsTexto] : []),
    ].join('\n');

    // Validações
    if (!todosItens) {
      ui.mostrarFeedback('⚠ Adicione ao menos 1 item ao pedido!', 'erro');
      return;
    }

    if (!valorRaw || isNaN(valor) || valor < 0) {
      ui.mostrarFeedback('⚠ Informe o valor do pedido!', 'erro');
      document.getElementById('inputValor').focus();
      return;
    }

    const pedido = {
      id:          Storage.gerarId(),
      cliente:     cliente || '',
      itens:       todosItens,
      valor:       valor,
      status:      'andamento',
      criadoEm:    new Date().toISOString(),
      concluidoEm: null,
      // Dados estruturados para futura API / relatórios
      _itensDetalhados: _itensPedido.slice(),
      _version: 2,
    };

    const ok = Storage.adicionar(pedido);

    if (ok) {
      // Reseta o rascunho
      _itensPedido = [];
      ui.limparForm();
      ui.renderizarItensAdicionados([]);
      ui.renderizarPedidos(Storage.listar());
      ui.mostrarFeedback('✓ Pedido adicionado!');

      // Volta para a aba de pedidos no mobile
      setTimeout(() => {
        if (window.innerWidth < 600) ui.switchTab('pedidos');
      }, 700);
    } else {
      ui.mostrarFeedback('Erro ao salvar. Tente novamente.', 'erro');
    }
  }

  /* ─── CONCLUIR PEDIDO ────────────────────────────────────── */

  function concluirPedido(id) {
    const ok = Storage.atualizar(id, {
      status:      'concluido',
      concluidoEm: new Date().toISOString(),
    });
    if (ok) ui.renderizarPedidos(Storage.listar());
  }

  /* ─── EXCLUIR PEDIDO ─────────────────────────────────────── */

  function confirmarExcluir(id) {
    ui.abrirModal('Excluir este pedido?', () => _excluirPedido(id));
  }

  function _excluirPedido(id) {
    const ok = Storage.remover(id);
    if (ok) ui.renderizarPedidos(Storage.listar());
  }

  /* ─── LIMPAR CONCLUÍDOS ──────────────────────────────────── */

  function limparConcluidos() {
    const concluidos = Storage.listar().filter(p => p.status === 'concluido');
    if (concluidos.length === 0) return;

    ui.abrirModal(
      `Limpar ${concluidos.length} pedido(s) concluído(s)?\nIsso não pode ser desfeito.`,
      () => {
        Storage.limparConcluidos();
        ui.renderizarPedidos(Storage.listar());
      }
    );
  }

  /* ─── BOOT ───────────────────────────────────────────────── */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // API pública
  return {
    criarPedido,
    concluirPedido,
    confirmarExcluir,
    limparConcluidos,
    adicionarItemAoPedido,
    removerItemDoPedido,
    limparItensPedido,
  };
})();
