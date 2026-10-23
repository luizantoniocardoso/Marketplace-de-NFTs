import { db } from '../db'
import { getScenario, isMockScenario, MOCK_SCENARIOS, setScenario, type MockScenario } from '../scenarios'
import {
  dropConnections,
  expireAllSessions,
  raisePrice,
  replayLastEvent,
  resumePendingOrders,
  updateEditions,
} from '../services'

export const mockControls = {
  scenarios: MOCK_SCENARIOS,
  getScenario,
  setScenario(scenario: MockScenario) {
    if (!isMockScenario(scenario)) throw new Error(`Cenário desconhecido: ${scenario}`)
    setScenario(scenario)
  },
  reset() {
    db.reset()
  },
  expireSessions: expireAllSessions,
  raisePrice,
  setAvailability(nftId: string, editionId: string, available: number) {
    return Boolean(updateEditions(nftId, { [editionId]: { available } }))
  },
  replayLastEvent,
  dropConnections,
}

export type MockControls = typeof mockControls

const SCENARIO_PARAM = 'scenario'
const RESET_PARAM = 'mock-reset'

export function applyMockParams(url: URL) {
  const scenario = url.searchParams.get(SCENARIO_PARAM)
  const reset = url.searchParams.has(RESET_PARAM)
  if (scenario && isMockScenario(scenario)) setScenario(scenario)
  if (reset) db.reset()
  if (!scenario && !reset) return null
  url.searchParams.delete(SCENARIO_PARAM)
  url.searchParams.delete(RESET_PARAM)
  return url
}

export function startMockServices() {
  resumePendingOrders()
}
