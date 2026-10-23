import { http } from 'msw'
import { env } from '@/shared/config'
import type { NewsletterSubscribeRequest } from '@/shared/contracts'
import { apiError, EMAIL_PATTERN, noContent, readJson, simulateNetwork } from '../services'

export const newsletterHandlers = [
  http.post(`${env.API_URL}/newsletter`, async ({ request }) => {
    const failure = await simulateNetwork()
    if (failure) return failure
    const body = await readJson<NewsletterSubscribeRequest>(request)
    if (!body.email || !EMAIL_PATTERN.test(body.email)) {
      return apiError('VALIDATION_ERROR', 'Informe um e-mail válido', { email: 'Informe um e-mail válido' })
    }
    return noContent()
  }),
]
