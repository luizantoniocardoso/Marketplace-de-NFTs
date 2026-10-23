import { z } from 'zod/mini'
import type { UserDto } from '@/shared/contracts'
import { MIN_PASSWORD_LENGTH, rules, splitEnsName } from '@/shared/lib'

export const profileSchema = z
  .object({
    displayName: rules.required('Informe o nome de exibição.'),
    username: rules.username(),
    email: rules.email(),
    ensSuffix: rules.ensSuffix(),
    ensLabel: rules.ensLabel(),
    walletNickname: rules.required('Informe o apelido da carteira.'),
    currentPassword: z.string(),
    newPassword: z.string(),
    confirmPassword: z.string(),
  })
  .check(
    z.refine((values) => !values.newPassword && !values.confirmPassword || Boolean(values.currentPassword), {
      error: 'Informe a senha atual para alterá-la.',
      path: ['currentPassword'],
    }),
    z.refine((values) => !values.currentPassword || values.newPassword.length >= MIN_PASSWORD_LENGTH, {
      error: `A nova senha precisa ter ao menos ${MIN_PASSWORD_LENGTH} caracteres.`,
      path: ['newPassword'],
    }),
    z.refine((values) => values.newPassword === values.confirmPassword, {
      error: 'As senhas não coincidem.',
      path: ['confirmPassword'],
    }),
  )

export type ProfileValues = z.infer<typeof profileSchema>

export function profileDefaults(user: UserDto | undefined): ProfileValues {
  const ens = splitEnsName(user?.ensName)
  return {
    displayName: user?.displayName ?? '',
    username: user?.username ?? '',
    email: user?.email ?? '',
    ensSuffix: ens.suffix,
    ensLabel: ens.label,
    walletNickname: user?.walletNickname ?? '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  }
}
