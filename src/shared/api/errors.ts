import { isAxiosError } from 'axios'
import type { ApiErrorBody } from '@/shared/contracts'

export function getApiError(error: unknown): ApiErrorBody['error'] & { status?: number } {
  if (isAxiosError<ApiErrorBody>(error)) {
    const body = error.response?.data
    if (body?.error) return { ...body.error, status: error.response?.status }
    if (!error.response) {
      return { code: 'UNAVAILABLE', message: 'Sem conexão com o servidor. Verifique sua rede e tente novamente.' }
    }
  }
  return { code: 'INTERNAL_ERROR', message: 'Algo deu errado. Tente novamente.' }
}
