import axios from 'axios'
import { env } from '@/shared/config'

export const http = axios.create({
  baseURL: env.API_URL,
  timeout: 10_000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})
