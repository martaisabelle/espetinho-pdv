/**
 * storage.js — Camada de persistência com LocalStorage
 *
 * Responsabilidade única: ler e gravar dados.
 * Isolado para facilitar futura migração para IndexedDB ou API REST.
 *
 * Estrutura salva:
 * espetinho_pedidos: Array de objetos Pedido
 * {
 *   id:        string  — UUID único
 *   cliente:   string  — nome do cliente (pode ser "Cliente")
 *   itens:     string  — descrição dos itens
 *   valor:     number  — valor em reais
 *   status:    'andamento' | 'concluido'
 *   criadoEm:  string  — ISO timestamp
 *   concluidoEm: string | null
 * }
 */

const Storage = (() => {
  const CHAVE = 'espetinho_pedidos';

  /** Retorna todos os pedidos salvos */
  function listar() {
    try {
      const raw = localStorage.getItem(CHAVE);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('[Storage] Erro ao ler pedidos:', e);
      return [];
    }
  }

  /** Salva a lista completa de pedidos */
  function salvarTodos(pedidos) {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(pedidos));
      return true;
    } catch (e) {
      console.error('[Storage] Erro ao salvar pedidos:', e);
      return false;
    }
  }

  /** Adiciona um novo pedido */
  function adicionar(pedido) {
    const pedidos = listar();
    pedidos.unshift(pedido); // mais recente no topo
    return salvarTodos(pedidos);
  }

  /** Atualiza um pedido pelo id */
  function atualizar(id, dadosNovos) {
    const pedidos = listar();
    const idx = pedidos.findIndex(p => p.id === id);
    if (idx === -1) return false;
    pedidos[idx] = { ...pedidos[idx], ...dadosNovos };
    return salvarTodos(pedidos);
  }

  /** Remove um pedido pelo id */
  function remover(id) {
    const pedidos = listar().filter(p => p.id !== id);
    return salvarTodos(pedidos);
  }

  /** Remove todos os pedidos com status 'concluido' */
  function limparConcluidos() {
    const pedidos = listar().filter(p => p.status !== 'concluido');
    return salvarTodos(pedidos);
  }

  /**
   * Gera um ID único simples.
   * Em produção com backend, o servidor geraria o ID.
   */
  function gerarId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  // API pública
  return { listar, adicionar, atualizar, remover, limparConcluidos, gerarId };
})();
