import { delay, HttpResponse } from 'msw'
import type { ApiErrorBody, ApiErrorCode } from '@/shared/contracts'
import { getScenario } from '../scenarios'

const STATUS: Record<ApiErrorCode, number> = {
  VALIDATION_ERROR: 422,
  UNAUTHENTICATED: 401,
  SESSION_EXPIRED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  OUT_OF_STOCK: 409,
  COUPON_INVALID: 422,
  COUPON_EXPIRED: 422,
  QUOTE_OUTDATED: 409,
  IDEMPOTENCY_CONFLICT: 409,
  WALLET_REJECTED: 403,
  UNAVAILABLE: 503,
  INTERNAL_ERROR: 500,
}

export function apiError(code: ApiErrorCode, message: string, fields?: Record<string, string>) {
  return HttpResponse.json<ApiErrorBody>({ error: { code, message, fields } }, { status: STATUS[code] })
}

export function noContent() {
  return new HttpResponse(null, { status: 204 })
}

let requestCount = 0

function latencyFor() {
  const scenario = getScenario()
  if (scenario === 'slow') return 2500
  if (scenario === 'variable-latency') {
    requestCount += 1
    return [1800, 300, 2500, 600, 100, 1200][requestCount % 6]
  }
  return undefined
}

export async function simulateNetwork(): Promise<Response | undefined> {
  const scenario = getScenario()
  if (scenario === 'offline') return HttpResponse.error()
  const latency = latencyFor()
  await (latency === undefined ? delay('real') : delay(latency))
  if (scenario === 'server-error') return apiError('INTERNAL_ERROR', 'O servidor falhou ao processar a requisição.')
  return undefined
}

export async function readJson<T>(request: Request): Promise<Partial<T>> {
  try {
    return ((await request.json()) ?? {}) as Partial<T>
  } catch {
    return {}
  }
}
