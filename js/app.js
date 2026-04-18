/**
 * app.js — Lógica de negócio  v3
 * Coordena: Storage ↔ Cardapio ↔ UI
 */

const app = (() => {

  /* ─── ESTADO DO RASCUNHO ─────────────────────────────── */
  let _itens = []; // itens selecionados do cardápio para o pedido atual

  /* ─── INIT ───────────────────────────────────────────── */

  function init() {
    ui.initTheme();
    ui.renderizarPedidos(Storage.listar());
    ui.initCardapio();

    // Enter no campo valor → cria pedido
    const valInput = document.getElementById('inputValor');
    if (valInput) {
      valInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') criarPedido();
      });
    }

    // No mobile, foca cliente ao trocar para aba novo
    const tabNovo = document.querySelector('[data-tab="novo"]');
    if (tabNovo) {
      tabNovo.addEventListener('click', () => {
        if (window.innerWidth < 640) {
          setTimeout(() => {
            const el = document.getElementById('inputCliente');
            if (el) el.focus();
          }, 80);
        }
      });
    }

    console.log('[App v3] pronto. Pedidos:', Storage.listar().length);
  }

  /* ─── CARDÁPIO ───────────────────────────────────────── */

  function adicionarItemAoPedido(item, qtd) {
    const existe = _itens.find(e => e.id === item.id);
    if (existe) {
      existe.qtd += qtd;
    } else {
      _itens.push({ id: item.id, icon: item.icon, nome: item.nome, preco: item.preco, qtd });
    }
    ui.renderizarItensAdicionados(_itens);
  }

  function removerItemDoPedido(idx) {
    _itens.splice(idx, 1);
    ui.renderizarItensAdicionados(_itens);
  }

  function limparItensPedido() {
    _itens = [];
    ui.renderizarItensAdicionados(_itens);
    const v = document.getElementById('inputValor');
    if (v) v.value = '';
  }

  /* ─── CRIAR PEDIDO ───────────────────────────────────── */

  function criarPedido() {
    const cliente  = (document.getElementById('inputCliente')?.value || '').trim();
    const obsTexto = (document.getElementById('inputItens')?.value   || '').trim();
    const valorRaw = document.getElementById('inputValor')?.value || '';
    const valor    = parseFloat(valorRaw);

    // Monta texto dos itens
    const linhas = _itens.map(e =>
      `${e.qtd}× ${e.nome}  ${ui.formatarDinheiro(e.qtd * e.preco)}`
    );
    if (obsTexto) linhas.push(obsTexto);
    const textoPedido = linhas.join('\n');

    // Validações
    if (!textoPedido.trim()) {
      ui.mostrarFeedback('⚠ Adicione ao menos 1 item!', 'erro');
      return;
    }

    if (!valorRaw || isNaN(valor) || valor < 0) {
      ui.mostrarFeedback('⚠ Informe o valor total!', 'erro');
      document.getElementById('inputValor')?.focus();
      return;
    }

    const pedido = {
      id:          Storage.gerarId(),
      cliente:     cliente,
      itens:       textoPedido,
      valor:       valor,
      status:      'andamento',
      criadoEm:    new Date().toISOString(),
      concluidoEm: null,
      _itensDetalhe: _itens.slice(),
      _v: 3,
    };

    if (Storage.adicionar(pedido)) {
      _itens = [];
      ui.limparForm();
      ui.renderizarItensAdicionados([]);
      ui.renderizarPedidos(Storage.listar());
      ui.mostrarFeedback('✓ Pedido adicionado!');
      if (window.innerWidth < 640) {
        setTimeout(() => ui.switchTab('pedidos'), 700);
      }
    } else {
      ui.mostrarFeedback('Erro ao salvar. Tente novamente.', 'erro');
    }
  }

  /* ─── CONCLUIR ───────────────────────────────────────── */

  function concluirPedido(id) {
    if (Storage.atualizar(id, {
      status: 'concluido',
      concluidoEm: new Date().toISOString(),
    })) {
      ui.renderizarPedidos(Storage.listar());
    }
  }

  /* ─── EXCLUIR ────────────────────────────────────────── */

  function confirmarExcluir(id) {
    ui.abrirModal('Excluir este pedido?', () => {
      if (Storage.remover(id)) {
        ui.renderizarPedidos(Storage.listar());
      }
    });
  }

  /* ─── LIMPAR CONCLUÍDOS ─────────────────────────────── */

  function limparConcluidos() {
    const lista = Storage.listar().filter(p => p.status === 'concluido');

    if (lista.length === 0) {
      ui.mostrarFeedback('Nenhum pedido concluído para limpar.', 'erro');
      return;
    }

    ui.abrirModal(
      `Apagar ${lista.length} pedido(s) concluído(s)?\nIsso não pode ser desfeito.`,
      () => {
        // Executa a limpeza e re-renderiza
        const ok = Storage.limparConcluidos();
        if (ok) {
          ui.renderizarPedidos(Storage.listar());
          ui.mostrarFeedback('Histórico do dia limpo.');
        }
      }
    );
  }

  /* ─── BOOT ───────────────────────────────────────────── */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

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
