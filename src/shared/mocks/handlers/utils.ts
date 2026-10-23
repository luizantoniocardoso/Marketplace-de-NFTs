import { delay, HttpResponse } from 'msw'
import type { ApiErrorBody, ApiErrorCode } from '@/shared/contracts'

const STATUS: Record<ApiErrorCode, number> = {
  VALIDATION_ERROR: 422,
  UNAUTHENTICATED: 401,
  SESSION_EXPIRED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNAVAILABLE: 503,
  INTERNAL_ERROR: 500,
}

export function apiError(code: ApiErrorCode, message: string, fields?: Record<string, string>) {
  return HttpResponse.json<ApiErrorBody>({ error: { code, message, fields } }, { status: STATUS[code] })
}

export function networkLatency() {
  return delay('real')
}
