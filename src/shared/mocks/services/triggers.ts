import { getScenario, SCENARIO_TRIGGER_DELAY_MS } from '../scenarios'
import { raisePrice, updateEditions } from './catalog'

export function onCartItemAdded(nftId: string, editionId: string) {
  const scenario = getScenario()
  if (scenario === 'price-change') {
    setTimeout(() => raisePrice(nftId, editionId, 10), SCENARIO_TRIGGER_DELAY_MS)
  }
  if (scenario === 'sold-out') {
    setTimeout(() => updateEditions(nftId, { [editionId]: { available: 0 } }), SCENARIO_TRIGGER_DELAY_MS)
  }
}
