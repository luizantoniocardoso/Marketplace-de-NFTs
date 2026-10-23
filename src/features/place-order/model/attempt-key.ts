import type { CreateOrderRequest } from '@/shared/contracts'
import { createIdempotencyKey } from '@/shared/lib'

const STORAGE_KEY = 'kurio:order-attempts'

function readAttempts(): Record<string, string> {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? '{}') as Record<string, string>
  } catch {
    return {}
  }
}

function attemptSignature(body: CreateOrderRequest) {
  return JSON.stringify([body.quoteFingerprint, body.walletId, body.provider, body.network, body.collector, body.note])
}

export function idempotencyKeyFor(body: CreateOrderRequest) {
  const attempts = readAttempts()
  const signature = attemptSignature(body)
  attempts[signature] ??= createIdempotencyKey()
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attempts))
  } catch {
    return attempts[signature]
  }
  return attempts[signature]
}

export function clearOrderAttempts() {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    return
  }
}
