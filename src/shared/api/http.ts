import axios, { isAxiosError } from 'axios'
import { env } from '@/shared/config'
import { API_HEADERS, type ApiErrorBody } from '@/shared/contracts'
import { emitAuthFailure } from './auth-events'
import { whenApiReady } from './readiness'
import { viewer } from './viewer'

export const http = axios.create({
  baseURL: env.API_URL,
  timeout: 10_000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  paramsSerializer: { indexes: null },
})

http.interceptors.request.use(async (config) => {
  await whenApiReady()
  const token = viewer.getToken()
  if (token) config.headers.set(API_HEADERS.authorization, `Bearer ${token}`)
  config.headers.set(API_HEADERS.cartId, viewer.getCartId())
  return config
})

http.interceptors.response.use(undefined, (error: unknown) => {
  if (isAxiosError<ApiErrorBody>(error) && error.response?.status === 401) {
    const code = error.response.data?.error?.code
    const sentToken = Boolean(error.config?.headers?.[API_HEADERS.authorization])
    if (sentToken && (code === 'SESSION_EXPIRED' || code === 'UNAUTHENTICATED')) emitAuthFailure(code)
  }
  return Promise.reject(error)
})
