import { http, HttpResponse } from 'msw'
import { env } from '@/shared/config'

export const httpHandlers = [
  http.get(`${env.API_URL}/health`, () => HttpResponse.json({ status: 'ok' })),
]
