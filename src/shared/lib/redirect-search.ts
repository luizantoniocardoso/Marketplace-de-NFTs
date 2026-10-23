import { z } from 'zod/mini'

export const redirectSearchSchema = z.object({
  redirect: z.catch(z.optional(z.string().check(z.startsWith('/'))), undefined),
})

export type RedirectSearch = z.infer<typeof redirectSearchSchema>
