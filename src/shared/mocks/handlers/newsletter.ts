import { http } from 'msw'
import { env } from '@/shared/config'
import type { NewsletterSubscribeRequest } from '@/shared/contracts'
import { EMAIL_PATTERN, VALIDATION_MESSAGES } from '@/shared/lib'
import { apiError, noContent, readJson, simulateNetwork } from '../services'

export const newsletterHandlers = [
  http.post(`${env.API_URL}/newsletter`, async ({ request }) => {
    const failure = await simulateNetwork()
    if (failure) return failure
    const body = await readJson<NewsletterSubscribeRequest>(request)
    if (!body.email || !EMAIL_PATTERN.test(body.email)) {
      return apiError('VALIDATION_ERROR', VALIDATION_MESSAGES.emailInvalid, { email: VALIDATION_MESSAGES.emailInvalid })
    }
    return noContent()
  }),
]
