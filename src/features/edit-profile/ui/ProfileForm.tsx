import type { ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { getApiError } from '@/shared/api'
import type { UserDto } from '@/shared/contracts'
import { standardResolver, useFormFields, useServerErrors } from '@/shared/lib'
import { Button, EnsNameInput, Field, FormError, PasswordInput, TextInput } from '@/shared/ui'
import { profileDefaults, profileSchema, useSaveProfile, type ProfileValues } from '../model'

interface ProfileFormProps {
  user: UserDto
  avatarSlot?: ReactNode
}

const SERVER_FIELDS = [
  'displayName',
  'username',
  'email',
  'ensLabel',
  'walletNickname',
  'currentPassword',
  'newPassword',
] as const

export function ProfileForm({ user, avatarSlot }: ProfileFormProps) {
  const save = useSaveProfile()
  const form = useForm<ProfileValues>({
    resolver: standardResolver(profileSchema),
    defaultValues: profileDefaults(user),
  })
  const fields = useFormFields(form)
  const serverErrors = useServerErrors(form.setError, SERVER_FIELDS)
  const displayName = fields('displayName')
  const username = fields('username')
  const email = fields('email')
  const ensLabel = fields('ensLabel')
  const walletNickname = fields('walletNickname')
  const currentPassword = fields('currentPassword')
  const newPassword = fields('newPassword')
  const confirmPassword = fields('confirmPassword')

  const onSubmit = form.handleSubmit((values) => {
    serverErrors.clear()
    save.mutate(values, {
      onSuccess: ({ user: saved, passwordChanged }) => {
        form.reset(profileDefaults(saved))
        toast.success(passwordChanged ? 'Perfil e senha atualizados.' : 'Perfil atualizado.')
      },
      onError: (error) => {
        const { message, fields: apiFields } = getApiError(error)
        const { ensName, ...rest } = apiFields ?? {}
        serverErrors.report({ message, fields: { ...rest, ...(ensName ? { ensLabel: ensName } : {}) } })
      },
    })
  })

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-x-7 gap-y-6 lg:grid-cols-2">
      <Field {...displayName.field} label="Nome de exibição" required>
        <TextInput autoComplete="name" {...displayName.control} />
      </Field>
      <Field {...username.field} label="Nome de usuário" required>
        <TextInput autoComplete="username" {...username.control} />
      </Field>
      <Field {...email.field} label="E-mail" required>
        <TextInput type="email" autoComplete="email" {...email.control} />
      </Field>
      <Field {...ensLabel.field} label="Nome ENS" required>
        <EnsNameInput suffixProps={form.register('ensSuffix')} {...ensLabel.control} />
      </Field>
      <Field {...walletNickname.field} label="Apelido da carteira" required>
        <TextInput autoComplete="off" {...walletNickname.control} />
      </Field>
      <div>{avatarSlot}</div>

      <fieldset className="flex flex-col gap-6 lg:col-start-1">
        <legend className="mb-6 text-body-lg font-bold text-foreground">Alterar senha</legend>
        <Field {...currentPassword.field} label="Senha atual">
          <PasswordInput autoComplete="current-password" {...currentPassword.control} />
        </Field>
        <Field {...newPassword.field} label="Nova senha">
          <PasswordInput autoComplete="new-password" {...newPassword.control} />
        </Field>
        <Field {...confirmPassword.field} label="Confirmar nova senha">
          <PasswordInput autoComplete="new-password" {...confirmPassword.control} />
        </Field>
      </fieldset>

      <div className="flex flex-col gap-3 lg:col-start-1">
        {serverErrors.formError && <FormError>{serverErrors.formError}</FormError>}
        <Button type="submit" variant="brand" size="md" className="w-[131px]" disabled={save.isPending}>
          {save.isPending ? 'Salvando…' : 'Salvar'}
        </Button>
      </div>
    </form>
  )
}
