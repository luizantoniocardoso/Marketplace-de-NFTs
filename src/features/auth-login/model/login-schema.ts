import { z } from 'zod/mini'
import { rules, VALIDATION_MESSAGES } from '@/shared/lib'

export const loginSchema = z.object({
  email: rules.email(),
  password: z.string().check(z.minLength(1, { error: VALIDATION_MESSAGES.passwordRequired })),
})

export type LoginValues = z.infer<typeof loginSchema>
