import { isAxiosError } from 'axios'
import type { ApiErrorBody, ApiErrorCode } from '@/shared/contracts'

export type ApiError = ApiErrorBody['error'] & { status?: number; timedOut?: boolean }

export function getApiError(error: unknown): ApiError {
  if (isAxiosError<ApiErrorBody>(error)) {
    const body = error.response?.data
    if (body?.error) return { ...body.error, status: error.response?.status }
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return { code: 'UNAVAILABLE', message: 'O servidor demorou para responder. Tente novamente.', timedOut: true }
    }
    if (!error.response) {
      return { code: 'UNAVAILABLE', message: 'Sem conexão com o servidor. Verifique sua rede e tente novamente.' }
    }
  }
  return { code: 'INTERNAL_ERROR', message: 'Algo deu errado. Tente novamente.' }
}

export function isApiError(error: unknown, ...codes: ApiErrorCode[]) {
  return codes.includes(getApiError(error).code)
}

export function isTimeoutError(error: unknown) {
  return Boolean(getApiError(error).timedOut)
}
