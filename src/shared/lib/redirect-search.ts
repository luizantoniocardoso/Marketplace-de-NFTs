import { z } from 'zod/mini'

export const redirectSearchSchema = z.object({
  redirect: z.catch(z.optional(z.string().check(z.startsWith('/'))), undefined),
  reason: z.catch(z.optional(z.enum(['expired'])), undefined),
})
