import { z } from 'zod/mini'
import type { UserDto } from '@/shared/contracts'
import { MIN_PASSWORD_LENGTH, rules, splitEnsName, VALIDATION_MESSAGES } from '@/shared/lib'

export const profileSchema = z
  .object({
    displayName: rules.required(VALIDATION_MESSAGES.displayNameRequired),
    username: rules.username(),
    email: rules.email(),
    ensSuffix: rules.ensSuffix(),
    ensLabel: rules.ensLabel(),
    walletNickname: rules.required(VALIDATION_MESSAGES.walletNicknameRequired),
    currentPassword: z.string(),
    newPassword: z.string(),
    confirmPassword: z.string(),
  })
  .check(
    z.refine((values) => (!values.newPassword && !values.confirmPassword) || Boolean(values.currentPassword), {
      error: 'Informe a senha atual para alterá-la.',
      path: ['currentPassword'],
    }),
    z.refine((values) => !values.currentPassword || values.newPassword.length >= MIN_PASSWORD_LENGTH, {
      error: VALIDATION_MESSAGES.passwordTooShort,
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
