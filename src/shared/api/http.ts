import axios from 'axios'
import { env } from '@/shared/config'
import { whenApiReady } from './readiness'

export const http = axios.create({
  baseURL: env.API_URL,
  timeout: 10_000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  paramsSerializer: { indexes: null },
})

http.interceptors.request.use(async (config) => {
  await whenApiReady()
  return config
})
