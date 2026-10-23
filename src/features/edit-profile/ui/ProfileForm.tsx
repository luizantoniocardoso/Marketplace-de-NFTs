import { useId, useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { getApiError } from '@/shared/api'
import { ENS_SUFFIXES, type UserDto } from '@/shared/contracts'
import { applyFieldErrors, standardResolver } from '@/shared/lib'
import { Button, Field, fieldDescribedBy, PasswordInput, SelectInput, TextInput } from '@/shared/ui'
import { profileDefaults, profileSchema, useSaveProfile, type ProfileValues } from '../model'

interface ProfileFormProps {
  user: UserDto
  avatarSlot?: ReactNode
}

const SERVER_FIELDS = ['displayName', 'username', 'email', 'walletNickname', 'currentPassword', 'newPassword'] as const

export function ProfileForm({ user, avatarSlot }: ProfileFormProps) {
  const id = useId()
  const [formError, setFormError] = useState<string>()
  const save = useSaveProfile()
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<ProfileValues>({ resolver: standardResolver(profileSchema), defaultValues: profileDefaults(user) })

  const onSubmit = handleSubmit((values) => {
    setFormError(undefined)
    save.mutate(values, {
      onSuccess: ({ user: saved, passwordChanged }) => {
        reset(profileDefaults(saved))
        toast.success(passwordChanged ? 'Perfil e senha atualizados.' : 'Perfil atualizado.')
      },
      onError: (error) => {
        const apiError = getApiError(error)
        const fields = { ...apiError.fields, ...(apiError.fields?.ensName ? { ensLabel: apiError.fields.ensName } : {}) }
        if (!applyFieldErrors(setError, fields, [...SERVER_FIELDS, 'ensLabel'])) setFormError(apiError.message)
      },
    })
  })

  const ids = Object.fromEntries(
    ['displayName', 'username', 'email', 'ensSuffix', 'ensLabel', 'walletNickname', 'currentPassword', 'newPassword', 'confirmPassword'].map(
      (name) => [name, `${id}-${name}`],
    ),
  ) as Record<keyof ProfileValues, string>

  const control = (name: keyof ProfileValues) => ({
    id: ids[name],
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': fieldDescribedBy(ids[name], errors[name]?.message),
    ...register(name),
  })

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-x-7 gap-y-6 lg:grid-cols-2">
      <Field id={ids.displayName} label="Nome de exibição" required error={errors.displayName?.message}>
        <TextInput autoComplete="name" {...control('displayName')} />
      </Field>
      <Field id={ids.username} label="Nome de usuário" required error={errors.username?.message}>
        <TextInput autoComplete="username" {...control('username')} />
      </Field>
      <Field id={ids.email} label="E-mail" required error={errors.email?.message}>
        <TextInput type="email" autoComplete="email" {...control('email')} />
      </Field>
      <Field id={ids.ensLabel} label="Nome ENS" required error={errors.ensLabel?.message}>
        <div className="flex gap-2.5">
          <SelectInput aria-label="Domínio ENS" className="w-auto min-w-[78px] px-2.5" {...register('ensSuffix')}>
            {ENS_SUFFIXES.map((suffix) => (
              <option key={suffix} value={suffix}>
                {suffix}
              </option>
            ))}
          </SelectInput>
          <TextInput className="flex-1" autoComplete="off" {...control('ensLabel')} />
        </div>
      </Field>
      <Field id={ids.walletNickname} label="Apelido da carteira" required error={errors.walletNickname?.message}>
        <TextInput autoComplete="off" {...control('walletNickname')} />
      </Field>
      <div className="lg:row-span-1">{avatarSlot}</div>

      <fieldset className="flex flex-col gap-6 lg:col-start-1">
        <legend className="mb-6 text-body-lg font-bold text-foreground">Alterar senha</legend>
        <Field id={ids.currentPassword} label="Senha atual" error={errors.currentPassword?.message}>
          <PasswordInput autoComplete="current-password" {...control('currentPassword')} />
        </Field>
        <Field id={ids.newPassword} label="Nova senha" error={errors.newPassword?.message}>
          <PasswordInput autoComplete="new-password" {...control('newPassword')} />
        </Field>
        <Field id={ids.confirmPassword} label="Confirmar nova senha" error={errors.confirmPassword?.message}>
          <PasswordInput autoComplete="new-password" {...control('confirmPassword')} />
        </Field>
      </fieldset>

      <div className="flex flex-col gap-3 lg:col-start-1">
        {formError && (
          <p role="alert" className="text-body text-coral">
            {formError}
          </p>
        )}
        <Button type="submit" variant="brand" size="md" className="w-[131px]" disabled={save.isPending}>
          {save.isPending ? 'Salvando…' : 'Salvar'}
        </Button>
      </div>
    </form>
  )
}
