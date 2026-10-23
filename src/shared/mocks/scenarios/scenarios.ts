export const MOCK_SCENARIOS = {
  default: 'Latência realista e todas as operações com sucesso',
  slow: 'Todas as respostas levam 2,5 s',
  'variable-latency': 'Latência variável entre 100 ms e 2,5 s, com respostas fora de ordem',
  offline: 'Falha de conexão em todas as requisições',
  'server-error': 'Respostas HTTP 500 em todas as requisições',
  'empty-catalog': 'Catálogo sem resultados',
  'session-expired': 'Toda requisição autenticada retorna sessão expirada',
  'favorites-error': 'Inclusão e remoção de favoritos falham com 503',
  'price-change': 'O preço do item sobe 10% alguns segundos após entrar no carrinho',
  'sold-out': 'A edição esgota alguns segundos após entrar no carrinho',
  'wallet-rejected': 'A carteira recusa a conexão',
  'order-timeout': 'A criação do pedido responde depois do timeout do cliente',
  'payment-declined': 'O pagamento é recusado após a criação do pedido',
} as const

export type MockScenario = keyof typeof MOCK_SCENARIOS

const STORAGE_KEY = 'kurio:mock-scenario'

export const SCENARIO_TRIGGER_DELAY_MS = 4000
export const ORDER_SETTLE_DELAY_MS = 3000
export const ORDER_TIMEOUT_DELAY_MS = 12_000

export function isMockScenario(value: string): value is MockScenario {
  return value in MOCK_SCENARIOS
}

export function getScenario(): MockScenario {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored && isMockScenario(stored) ? stored : 'default'
  } catch {
    return 'default'
  }
}

export function setScenario(scenario: MockScenario) {
  try {
    if (scenario === 'default') localStorage.removeItem(STORAGE_KEY)
    else localStorage.setItem(STORAGE_KEY, scenario)
  } catch {
    return
  }
}

export function isScenario(scenario: MockScenario) {
  return getScenario() === scenario
}
