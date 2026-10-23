import { useMutation } from '@tanstack/react-query'
import { http } from '@/shared/api'
import type { NewsletterSubscribeRequest } from '@/shared/contracts'

export function useSubscribeNewsletter() {
  return useMutation({
    mutationFn: (body: NewsletterSubscribeRequest) => http.post('/newsletter', body),
  })
}
