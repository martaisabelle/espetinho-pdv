/**
 * ui.js — Camada de interface  v3
 * SVGs customizados, tema light por padrão, bugs de delete corrigidos.
 */

const ui = (() => {

  /* ─── TEMA ──────────────────────────────────────────── */

  const CHAVE_TEMA = 'esp_tema';

  function initTheme() {
    // Light é o padrão — só muda se o usuário salvou preferência
    const salvo = localStorage.getItem(CHAVE_TEMA) || 'light';
    _aplicarTema(salvo);
  }

  function toggleTheme() {
    const atual = document.documentElement.getAttribute('data-theme') || 'light';
    _aplicarTema(atual === 'light' ? 'dark' : 'light');
  }

  function _aplicarTema(tema) {
    document.documentElement.setAttribute('data-theme', tema);
    localStorage.setItem(CHAVE_TEMA, tema);

    const iconEl = document.getElementById('themeIcon');
    const metaEl = document.getElementById('themeColorMeta');

    if (iconEl) {
      iconEl.innerHTML = tema === 'light' ? Icons.get('moon') : Icons.get('sun');
    }
    if (metaEl) {
      metaEl.content = tema === 'light' ? '#faf6f0' : '#111010';
    }
  }

  /* ─── ABAS (mobile) ─────────────────────────────────── */

  function switchTab(nome) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    const btn     = document.querySelector(`.tab[data-tab="${nome}"]`);
    const content = document.getElementById(`tab-${nome}`);
    if (btn)     btn.classList.add('active');
    if (content) content.classList.add('active');
  }

  /* ─── CARDÁPIO: GRID ────────────────────────────────── */

  function initCardapio() {
    filtrarCardapio('espeto');
    _initBusca();
  }

  function filtrarCardapio(cat) {
    // Atualiza botões
    document.querySelectorAll('.cardapio-tab').forEach(b => {
      b.classList.toggle('active', b.dataset.cat === cat);
    });

    const itens = Cardapio.getPorCategoria(cat);
    const grid  = document.getElementById('cardapioGrid');
    grid.innerHTML = '';

    itens.forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'cardapio-item';
      btn.setAttribute('type', 'button');
      btn.innerHTML = `
        <div class="ci-icon">${Icons.get(item.icon, { size: 22 })}</div>
        <span class="ci-nome">${_esc(item.nome)}</span>
        <span class="ci-preco">${_fmt(item.preco)}</span>
      `;
      btn.addEventListener('click', () => abrirModalQtd(item.id));
      grid.appendChild(btn);
    });
  }

  /* ─── CARDÁPIO: BUSCA ───────────────────────────────── */

  function _initBusca() {
    const input = document.getElementById('inputBuscaCardapio');
    const drop  = document.getElementById('cardapioSugestoes');
    if (!input || !drop) return;

    input.addEventListener('input', () => {
      const val       = input.value.trim();
      const encontrados = Cardapio.buscarPorNome(val);
      drop.innerHTML  = '';

      if (val && encontrados.length) {
        drop.classList.add('open');
        encontrados.slice(0, 8).forEach(item => {
          const row = document.createElement('div');
          row.className = 'sug-item';
          row.innerHTML = `
            <div class="sug-icon">${Icons.get(item.icon, { size: 18 })}</div>
            <span class="sug-nome">${_esc(item.nome)}</span>
            <span class="sug-preco">${_fmt(item.preco)}</span>
          `;
          row.addEventListener('click', () => {
            drop.classList.remove('open');
            input.value = '';
            abrirModalQtd(item.id);
          });
          drop.appendChild(row);
        });
      } else {
        drop.classList.remove('open');
      }
    });

    document.addEventListener('click', e => {
      if (!input.contains(e.target) && !drop.contains(e.target)) {
        drop.classList.remove('open');
      }
    });
  }

  /* ─── MODAL: QUANTIDADE ─────────────────────────────── */

  let _itemAtualId = null;
  let _qtdAtual    = 1;

  function abrirModalQtd(itemId) {
    const item = Cardapio.pegarPorId(itemId);
    if (!item) return;

    _itemAtualId = itemId;
    _qtdAtual    = 1;

    document.getElementById('modalItemIconWrap').innerHTML =
      Icons.get(item.icon, { size: 28 });
    document.getElementById('modalItemNome').textContent  = item.nome;
    document.getElementById('modalItemPreco').textContent = `${_fmt(item.preco)} / un.`;
    _updateSubtotal(item);

    document.getElementById('modalQtdOverlay').classList.add('open');
  }

  function ajustarQtd(delta) {
    _qtdAtual = Math.max(1, _qtdAtual + delta);
    const item = Cardapio.pegarPorId(_itemAtualId);
    if (item) _updateSubtotal(item);
  }

  function _updateSubtotal(item) {
    document.getElementById('qtdValue').textContent    = _qtdAtual;
    document.getElementById('qtdSubtotal').textContent = 'Subtotal: ' + _fmt(_qtdAtual * item.preco);
  }

  function confirmarItem() {
    const item = Cardapio.pegarPorId(_itemAtualId);
    if (!item) return;
    fecharModalQtd();
    app.adicionarItemAoPedido(item, _qtdAtual);
  }

  function fecharModalQtd() {
    document.getElementById('modalQtdOverlay').classList.remove('open');
    _itemAtualId = null;
    _qtdAtual    = 1;
  }

  /* ─── ITENS ADICIONADOS ─────────────────────────────── */

  function renderizarItensAdicionados(itensPedido) {
    const wrapper = document.getElementById('fieldItensAdicionados');
    const lista   = document.getElementById('itensAdicionados');
    const hint    = document.getElementById('valorCalcHint');

    lista.innerHTML = '';

    if (!itensPedido || itensPedido.length === 0) {
      wrapper.style.display = 'none';
      if (hint) hint.textContent = '';
      return;
    }

    wrapper.style.display = 'flex';

    let total = 0;
    itensPedido.forEach((entry, idx) => {
      const sub = entry.qtd * entry.preco;
      total += sub;

      const row = document.createElement('div');
      row.className = 'item-adicionado';
      row.innerHTML = `
        <div class="ia-icon">${Icons.get(entry.icon, { size: 16 })}</div>
        <span class="ia-qtd">${entry.qtd}×</span>
        <span class="ia-nome">${_esc(entry.nome)}</span>
        <span class="ia-preco">${_fmt(sub)}</span>
        <button class="ia-remove" type="button" data-idx="${idx}" title="Remover">
          ${Icons.get('close', { size: 13 })}
        </button>
      `;
      // Bind direto no botão — sem onclick inline, sem problema de escopo
      row.querySelector('.ia-remove').addEventListener('click', function() {
        const i = parseInt(this.dataset.idx, 10);
        app.removerItemDoPedido(i);
      });

      lista.appendChild(row);
    });

    if (hint) hint.textContent = `← calc: ${_fmt(total)}`;
    document.getElementById('inputValor').value = total.toFixed(2);
  }

  /* ─── PEDIDOS ───────────────────────────────────────── */

  function renderizarPedidos(pedidos) {
    const andamento = pedidos.filter(p => p.status === 'andamento');
    const concluidos = pedidos.filter(p => p.status === 'concluido');

    _renderLista('listaPedidos',    andamento,   'emptyPedidos');
    _renderLista('listaConcluidos', concluidos,  'emptyConcluidos');
    _updateCounters(andamento, concluidos);
    _updateSummary(concluidos);
  }

  function _renderLista(listId, pedidos, emptyId) {
    const container = document.getElementById(listId);
    const emptyEl   = document.getElementById(emptyId);

    container.querySelectorAll('.order-card').forEach(el => el.remove());

    if (!pedidos.length) {
      if (emptyEl) emptyEl.style.display = 'flex';
      return;
    }

    if (emptyEl) emptyEl.style.display = 'none';
    pedidos.forEach(p => container.appendChild(_criarCard(p)));
  }

  function _criarCard(pedido) {
    const card = document.createElement('div');
    card.className = 'order-card' + (pedido.status === 'concluido' ? ' order-card--done' : '');
    card.dataset.id = pedido.id;

    const cliente = _esc(pedido.cliente || 'Cliente');
    const hora    = _hora(pedido.criadoEm);
    const valor   = _fmt(pedido.valor);

    // Ações — usam addEventListener depois do innerHTML, sem onclick inline em data
    const isAndamento = pedido.status === 'andamento';
    const acoes = isAndamento
      ? `<button class="btn btn--success btn--icon" data-action="concluir" title="Marcar como feito">
           ${Icons.get('check', { size: 16 })}
         </button>
         <button class="btn btn--ghost btn--icon" data-action="excluir" title="Excluir pedido">
           ${Icons.get('trash', { size: 15 })}
         </button>`
      : `<button class="btn btn--ghost btn--icon" data-action="excluir" title="Excluir pedido">
           ${Icons.get('trash', { size: 15 })}
         </button>`;

    card.innerHTML = `
      <div class="order-card-header">
        <span class="order-client-badge">${cliente}</span>
        <span class="order-time-badge">${hora}</span>
      </div>
      <div class="order-items-text">${_esc(pedido.itens)}</div>
      <div class="order-card-footer">
        <span class="order-value">${valor}</span>
        <div class="order-actions">${acoes}</div>
      </div>
    `;

    // Event listeners no card — resolvem o bug do X não funcionar
    if (isAndamento) {
      card.querySelector('[data-action="concluir"]').addEventListener('click', () => {
        app.concluirPedido(pedido.id);
      });
    }
    card.querySelector('[data-action="excluir"]').addEventListener('click', () => {
      app.confirmarExcluir(pedido.id);
    });

    return card;
  }

  /* ─── CONTADORES ────────────────────────────────────── */

  function _updateCounters(andamento, concluidos) {
    const total      = andamento.length + concluidos.length;
    const totalValor = [...andamento, ...concluidos]
      .reduce((a, p) => a + Number(p.valor || 0), 0);

    // Header KPI
    const kpiVal   = document.getElementById('headerKpiValue');
    const kpiLabel = document.getElementById('headerKpiLabel');
    if (kpiVal)   kpiVal.textContent   = _fmt(totalValor);
    if (kpiLabel) kpiLabel.textContent = `${total} ${total === 1 ? 'pedido' : 'pedidos'}`;

    // Tab badges
    const bP = document.getElementById('badgePedidos');
    const bC = document.getElementById('badgeConcluidos');
    if (bP) bP.textContent = andamento.length;
    if (bC) bC.textContent = concluidos.length;

    // Section counts
    const cA = document.getElementById('countAndamento');
    const cC = document.getElementById('countConcluidos');
    if (cA) cA.textContent = andamento.length;
    if (cC) cC.textContent = concluidos.length;
  }

  function _updateSummary(concluidos) {
    const total = concluidos.reduce((a, p) => a + Number(p.valor || 0), 0);
    const rT    = document.getElementById('resumoTotal');
    const rQ    = document.getElementById('resumoQtd');
    if (rT) rT.textContent = _fmt(total);
    if (rQ) rQ.textContent = concluidos.length;
  }

  /* ─── FEEDBACK ──────────────────────────────────────── */

  let _fbTimer = null;

  function mostrarFeedback(msg, tipo = 'ok') {
    const el = document.getElementById('feedback');
    if (!el) return;
    el.textContent = msg;
    el.style.color = tipo === 'erro' ? 'var(--danger)' : 'var(--success)';
    clearTimeout(_fbTimer);
    _fbTimer = setTimeout(() => { el.textContent = ''; }, 2800);
  }

  /* ─── MODAL GENÉRICO ────────────────────────────────── */

  let _modalCb  = null;
  let _modalHandler = null; // guarda referência para poder remover

  function abrirModal(texto, cb) {
    _modalCb = cb;

    const textEl = document.getElementById('modalText');
    if (textEl) textEl.textContent = texto;

    const overlay    = document.getElementById('modalOverlay');
    const confirmBtn = document.getElementById('modalConfirm');

    // Remove handler anterior se existir (evita empilhamento)
    if (_modalHandler) {
      confirmBtn.removeEventListener('click', _modalHandler);
      _modalHandler = null;
    }

    _modalHandler = () => {
      const fn = _modalCb;   // captura ANTES de fechar (fecharModal zera _modalCb)
      fecharModal();
      if (typeof fn === 'function') fn();
    };

    confirmBtn.addEventListener('click', _modalHandler);
    overlay.classList.add('open');
  }

  function fecharModal() {
    document.getElementById('modalOverlay').classList.remove('open');
    _modalCb = null;
    // NÃO remove _modalHandler aqui — removeEventListener é feito no próximo abrirModal
  }

  /* ─── LIMPAR FORM ───────────────────────────────────── */

  function limparForm() {
    const f = id => document.getElementById(id);
    if (f('inputCliente')) f('inputCliente').value = '';
    if (f('inputItens'))   f('inputItens').value   = '';
    if (f('inputValor'))   f('inputValor').value   = '';
  }

  /* ─── UTILITÁRIOS ───────────────────────────────────── */

  function _fmt(v) {
    return 'R$ ' + Number(v).toLocaleString('pt-BR', {
      minimumFractionDigits: 2, maximumFractionDigits: 2,
    });
  }

  function _hora(iso) {
    return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  function _esc(s) {
    return String(s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // API pública
  return {
    initTheme, toggleTheme,
    switchTab,
    initCardapio, filtrarCardapio,
    abrirModalQtd, ajustarQtd, confirmarItem, fecharModalQtd,
    renderizarItensAdicionados,
    renderizarPedidos,
    mostrarFeedback,
    abrirModal, fecharModal,
    limparForm,
    formatarDinheiro: _fmt,
  };
})();