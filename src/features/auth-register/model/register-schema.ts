import { z } from 'zod/mini'
import { rules } from '@/shared/lib'

export const registerSchema = z
  .object({
    username: rules.username(),
    email: rules.email(),
    password: rules.newPassword(),
    confirmPassword: z.string(),
  })
  .check(
    z.refine((values) => values.password === values.confirmPassword, {
      error: 'As senhas não coincidem.',
      path: ['confirmPassword'],
    }),
  )

export type RegisterValues = z.infer<typeof registerSchema>
