/**
 * ui.js — Camada de interface
 *
 * Responsabilidades:
 * - Renderizar pedidos, listas, cards
 * - Trocar abas (mobile) / layout PC (tudo visível)
 * - Cardápio: grid de itens, autocomplete, filtros por categoria
 * - Modal de quantidade (sem prompt nativo)
 * - Toggle de tema claro/escuro
 * - Feedbacks visuais
 */

const ui = (() => {

  /* ─── TEMA ──────────────────────────────────────────────── */

  const CHAVE_TEMA = 'espetinho_tema';

  function initTheme() {
    const salvo = localStorage.getItem(CHAVE_TEMA) || 'dark';
    _aplicarTema(salvo);
  }

  function toggleTheme() {
    const atual = document.documentElement.getAttribute('data-theme') || 'dark';
    _aplicarTema(atual === 'dark' ? 'light' : 'dark');
  }

  function _aplicarTema(tema) {
    document.documentElement.setAttribute('data-theme', tema);
    localStorage.setItem(CHAVE_TEMA, tema);

    const icon = document.getElementById('themeIcon');
    const meta  = document.getElementById('themeColorMeta');
    if (icon) icon.textContent = tema === 'dark' ? '☀️' : '🌙';
    if (meta) meta.content = tema === 'dark' ? '#0d0d0d' : '#f4f1eb';
  }

  /* ─── ABAS (mobile) ──────────────────────────────────────── */

  function switchTab(nome) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    const tabBtn     = document.querySelector(`.tab[data-tab="${nome}"]`);
    const tabContent = document.getElementById(`tab-${nome}`);
    if (tabBtn)     tabBtn.classList.add('active');
    if (tabContent) tabContent.classList.add('active');
  }

  /* ─── CARDÁPIO: GRID DE ITENS ────────────────────────────── */

  let _catAtiva = 'espeto';

  function initCardapio() {
    filtrarCardapio('espeto');
    _initBuscaCardapio();
  }

  function filtrarCardapio(categoria) {
    _catAtiva = categoria;

    // Atualiza botões de filtro
    document.querySelectorAll('.cardapio-tab').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.cat === categoria);
    });

    // Renderiza grid
    const itens = Cardapio.getPorCategoria(categoria);
    _renderizarGrid(itens);
  }

  function _renderizarGrid(itens) {
    const grid = document.getElementById('cardapioGrid');
    grid.innerHTML = '';

    itens.forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'cardapio-item';
      btn.innerHTML = `
        <span class="cardapio-item-emoji">${item.emoji}</span>
        <span class="cardapio-item-nome">${item.nome}</span>
        <span class="cardapio-item-preco">${formatarDinheiro(item.preco)}</span>
      `;
      btn.addEventListener('click', () => abrirModalQtd(item.id));
      grid.appendChild(btn);
    });
  }

  /* ─── CARDÁPIO: AUTOCOMPLETE ────────────────────────────── */

  function _initBuscaCardapio() {
    const input     = document.getElementById('inputBuscaCardapio');
    const sugestoes = document.getElementById('cardapioSugestoes');

    input.addEventListener('input', () => {
      const val = input.value.trim();
      const encontrados = Cardapio.buscarPorNome(val);

      sugestoes.innerHTML = '';

      if (val && encontrados.length > 0) {
        sugestoes.classList.add('open');
        encontrados.slice(0, 8).forEach(item => {
          const div = document.createElement('div');
          div.className = 'sug-item';
          div.innerHTML = `
            <span>${item.emoji}</span>
            <span class="sug-item-nome">${item.nome}</span>
            <span class="sug-item-preco">${formatarDinheiro(item.preco)}</span>
          `;
          div.addEventListener('click', () => {
            sugestoes.classList.remove('open');
            input.value = '';
            abrirModalQtd(item.id);
          });
          sugestoes.appendChild(div);
        });
      } else {
        sugestoes.classList.remove('open');
      }
    });

    // Fecha ao clicar fora
    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !sugestoes.contains(e.target)) {
        sugestoes.classList.remove('open');
      }
    });
  }

  /* ─── MODAL: QUANTIDADE ──────────────────────────────────── */

  let _itemAtualId = null;
  let _qtdAtual    = 1;

  function abrirModalQtd(itemId) {
    const item = Cardapio.pegarPorId(itemId);
    if (!item) return;

    _itemAtualId = itemId;
    _qtdAtual    = 1;

    document.getElementById('modalItemEmoji').textContent = item.emoji;
    document.getElementById('modalItemNome').textContent  = item.nome;
    document.getElementById('modalItemPreco').textContent = `${formatarDinheiro(item.preco)} / un.`;
    _atualizarSubtotalModal(item);

    document.getElementById('modalQtdOverlay').classList.add('open');
  }

  function ajustarQtd(delta) {
    _qtdAtual = Math.max(1, _qtdAtual + delta);
    document.getElementById('qtdValue').textContent = _qtdAtual;
    const item = Cardapio.pegarPorId(_itemAtualId);
    if (item) _atualizarSubtotalModal(item);
  }

  function _atualizarSubtotalModal(item) {
    document.getElementById('qtdValue').textContent   = _qtdAtual;
    document.getElementById('qtdSubtotal').textContent =
      'Subtotal: ' + formatarDinheiro(_qtdAtual * item.preco);
  }

  function confirmarItem() {
    const item = Cardapio.pegarPorId(_itemAtualId);
    if (!item) return;

    fecharModalQtd();

    // Delega a lógica de adicionar ao app.js
    app.adicionarItemAoPedido(item, _qtdAtual);
  }

  function fecharModalQtd() {
    document.getElementById('modalQtdOverlay').classList.remove('open');
    _itemAtualId = null;
    _qtdAtual    = 1;
  }

  /* ─── RENDERIZAR LISTA DE ITENS ADICIONADOS ──────────────── */

  function renderizarItensAdicionados(itensPedido) {
    const campo   = document.getElementById('fieldItensAdicionados');
    const lista   = document.getElementById('itensAdicionados');
    const hintEl  = document.getElementById('valorCalcHint');

    lista.innerHTML = '';

    if (!itensPedido || itensPedido.length === 0) {
      campo.style.display = 'none';
      if (hintEl) hintEl.textContent = '';
      return;
    }

    campo.style.display = 'flex';

    let totalCalc = 0;

    itensPedido.forEach((entry, idx) => {
      const subtotal = entry.qtd * entry.preco;
      totalCalc += subtotal;

      const row = document.createElement('div');
      row.className = 'item-adicionado';
      row.innerHTML = `
        <span class="item-add-qtd">${entry.qtd}×</span>
        <span class="item-add-nome">${escapeHtml(entry.emoji + ' ' + entry.nome)}</span>
        <span class="item-add-preco">${formatarDinheiro(subtotal)}</span>
        <button class="item-add-remove" title="Remover" onclick="app.removerItemDoPedido(${idx})">✕</button>
      `;
      lista.appendChild(row);
    });

    // Atualiza hint e campo de valor
    if (hintEl) hintEl.textContent = `← calculado: ${formatarDinheiro(totalCalc)}`;
    document.getElementById('inputValor').value = totalCalc.toFixed(2);
  }

  /* ─── RENDERIZAR PEDIDOS ─────────────────────────────────── */

  function renderizarPedidos(pedidos) {
    const emAndamento = pedidos.filter(p => p.status === 'andamento');
    const concluidos  = pedidos.filter(p => p.status === 'concluido');

    _renderizarLista('listaPedidos',    emAndamento, 'emptyPedidos');
    _renderizarLista('listaConcluidos', concluidos,  'emptyConcluidos');

    _atualizarContadores(emAndamento, concluidos);
    _atualizarResumo(concluidos);
  }

  function _renderizarLista(listaId, pedidos, emptyId) {
    const container = document.getElementById(listaId);
    const empty     = document.getElementById(emptyId);

    container.querySelectorAll('.order-card').forEach(el => el.remove());

    if (pedidos.length === 0) {
      empty.style.display = 'block';
      return;
    }

    empty.style.display = 'none';
    pedidos.forEach(p => container.appendChild(_criarCard(p)));
  }

  function _criarCard(pedido) {
    const card = document.createElement('div');
    card.className = 'order-card' + (pedido.status === 'concluido' ? ' order-card--done' : '');
    card.dataset.id = pedido.id;

    const clienteLabel = pedido.cliente || 'Cliente';

    let acoes = '';
    if (pedido.status === 'andamento') {
      acoes = `
        <div class="order-actions">
          <button class="btn btn--green btn--icon" title="Concluir"
            onclick="app.concluirPedido('${pedido.id}')">✓</button>
          <button class="btn btn--ghost btn--icon" title="Excluir"
            onclick="app.confirmarExcluir('${pedido.id}')">✕</button>
        </div>`;
    } else {
      acoes = `
        <div class="order-actions">
          <button class="btn btn--ghost btn--icon" title="Excluir"
            onclick="app.confirmarExcluir('${pedido.id}')">✕</button>
        </div>`;
    }

    card.innerHTML = `
      <div class="order-card-top">
        <span class="order-name">${escapeHtml(clienteLabel)}</span>
        <span class="order-time">${_formatarHorario(pedido.criadoEm)}</span>
      </div>
      <div class="order-items">${escapeHtml(pedido.itens)}</div>
      <div class="order-footer">
        <span class="order-value">${formatarDinheiro(pedido.valor)}</span>
        ${acoes}
      </div>
    `;
    return card;
  }

  /* ─── CONTADORES E RESUMO ────────────────────────────────── */

  function _atualizarContadores(emAndamento, concluidos) {
    const total = emAndamento.length + concluidos.length;

    document.getElementById('summaryCount').textContent =
      total + (total === 1 ? ' pedido' : ' pedidos');

    const totalValor = [...emAndamento, ...concluidos]
      .reduce((acc, p) => acc + Number(p.valor || 0), 0);
    document.getElementById('summaryTotal').textContent = formatarDinheiro(totalValor);

    document.getElementById('badgePedidos').textContent    = emAndamento.length;
    document.getElementById('badgeConcluidos').textContent = concluidos.length;
    document.getElementById('countAndamento').textContent  = emAndamento.length;
    document.getElementById('countConcluidos').textContent = concluidos.length;
  }

  function _atualizarResumo(concluidos) {
    const totalValor = concluidos.reduce((acc, p) => acc + Number(p.valor || 0), 0);
    document.getElementById('resumoTotal').textContent = formatarDinheiro(totalValor);
    document.getElementById('resumoQtd').textContent   = concluidos.length;
  }

  /* ─── FEEDBACK ───────────────────────────────────────────── */

  let _feedbackTimer = null;

  function mostrarFeedback(msg, tipo = 'ok') {
    const el = document.getElementById('feedback');
    el.textContent = msg;
    el.style.color = tipo === 'erro' ? 'var(--red)' : 'var(--green)';
    clearTimeout(_feedbackTimer);
    _feedbackTimer = setTimeout(() => { el.textContent = ''; }, 2500);
  }

  /* ─── MODAL DE CONFIRMAÇÃO ───────────────────────────────── */

  let _modalCallback = null;

  function abrirModal(texto, callback) {
    _modalCallback = callback;
    document.getElementById('modalText').textContent = texto;
    document.getElementById('modalOverlay').classList.add('open');
    document.getElementById('modalConfirm').onclick = () => {
      fecharModal();
      if (_modalCallback) _modalCallback();
    };
  }

  function fecharModal() {
    document.getElementById('modalOverlay').classList.remove('open');
    _modalCallback = null;
  }

  /* ─── LIMPAR FORMULÁRIO ──────────────────────────────────── */

  function limparForm() {
    document.getElementById('inputCliente').value = '';
    document.getElementById('inputItens').value   = '';
    document.getElementById('inputValor').value   = '';
    // Foca cliente apenas no mobile (no desktop pode atrapalhar)
    if (window.innerWidth < 600) {
      document.getElementById('inputCliente').focus();
    }
  }

  /* ─── FORMATAÇÃO ──────────────────────────────────────────── */

  function formatarDinheiro(valor) {
    return 'R$ ' + Number(valor).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function _formatarHorario(isoString) {
    return new Date(isoString).toLocaleTimeString('pt-BR', {
      hour: '2-digit', minute: '2-digit',
    });
  }

  /* ─── UTILITÁRIO ─────────────────────────────────────────── */

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // API pública
  return {
    initTheme,
    toggleTheme,
    switchTab,
    initCardapio,
    filtrarCardapio,
    abrirModalQtd,
    ajustarQtd,
    confirmarItem,
    fecharModalQtd,
    renderizarItensAdicionados,
    renderizarPedidos,
    mostrarFeedback,
    abrirModal,
    fecharModal,
    limparForm,
    formatarDinheiro,
  };
})();
