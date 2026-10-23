import { http, HttpResponse } from 'msw'
import { env } from '@/shared/config'
import type { NewsletterSubscribeRequest } from '@/shared/contracts'
import { apiError, networkLatency } from './utils'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const newsletterHandlers = [
  http.post<never, NewsletterSubscribeRequest>(`${env.API_URL}/newsletter`, async ({ request }) => {
    await networkLatency()
    const body = (await request.json().catch(() => ({}))) as Partial<NewsletterSubscribeRequest>
    if (!body.email || !EMAIL.test(body.email)) {
      return apiError('VALIDATION_ERROR', 'Informe um e-mail válido', { email: 'Informe um e-mail válido' })
    }
    return new HttpResponse(null, { status: 204 })
  }),
]
