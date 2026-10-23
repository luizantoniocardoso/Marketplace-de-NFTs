import { z } from 'zod/mini'
import { rules } from '@/shared/lib'

export const loginSchema = z.object({
  email: rules.email(),
  password: z.string().check(z.minLength(1, { error: 'Informe sua senha.' })),
})

export type LoginValues = z.infer<typeof loginSchema>
