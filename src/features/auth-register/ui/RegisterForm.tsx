import { useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { getApiError } from '@/shared/api'
import type { UserDto } from '@/shared/contracts'
import { applyFieldErrors, standardResolver } from '@/shared/lib'
import { Button, Field, fieldDescribedBy, PasswordInput, TextInput } from '@/shared/ui'
import { registerSchema, useRegister, type RegisterValues } from '../model'

interface RegisterFormProps {
  onSuccess?: (user: UserDto) => void
  submitLabel?: string
}

export function RegisterForm({ onSuccess, submitLabel = 'Criar conta' }: RegisterFormProps) {
  const id = useId()
  const [formError, setFormError] = useState<string>()
  const registerMutation = useRegister()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: standardResolver(registerSchema),
    defaultValues: { username: '', email: '', password: '', confirmPassword: '' },
  })

  const onSubmit = handleSubmit(({ username, email, password }) => {
    setFormError(undefined)
    registerMutation.mutate(
      { username, email, password },
      {
        onSuccess: (response) => onSuccess?.(response.user),
        onError: (error) => {
          const apiError = getApiError(error)
          if (!applyFieldErrors(setError, apiError.fields, ['username', 'email', 'password'])) setFormError(apiError.message)
        },
      },
    )
  })

  const fields = {
    username: `${id}-username`,
    email: `${id}-email`,
    password: `${id}-password`,
    confirmPassword: `${id}-confirm`,
  }

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-3">
      <Field id={fields.username} label="Nome de usuário" hideLabel error={errors.username?.message}>
        <TextInput
          id={fields.username}
          autoComplete="username"
          placeholder="Nome de usuário"
          aria-invalid={errors.username ? true : undefined}
          aria-describedby={fieldDescribedBy(fields.username, errors.username?.message)}
          {...register('username')}
        />
      </Field>
      <Field id={fields.email} label="E-mail" hideLabel error={errors.email?.message}>
        <TextInput
          id={fields.email}
          type="email"
          autoComplete="email"
          placeholder="Digite seu e-mail"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={fieldDescribedBy(fields.email, errors.email?.message)}
          {...register('email')}
        />
      </Field>
      <Field id={fields.password} label="Senha" hideLabel error={errors.password?.message}>
        <PasswordInput
          id={fields.password}
          autoComplete="new-password"
          placeholder="Senha"
          aria-invalid={errors.password ? true : undefined}
          aria-describedby={fieldDescribedBy(fields.password, errors.password?.message)}
          {...register('password')}
        />
      </Field>
      <Field id={fields.confirmPassword} label="Confirmar senha" hideLabel error={errors.confirmPassword?.message}>
        <PasswordInput
          id={fields.confirmPassword}
          autoComplete="new-password"
          placeholder="Confirmar senha"
          aria-invalid={errors.confirmPassword ? true : undefined}
          aria-describedby={fieldDescribedBy(fields.confirmPassword, errors.confirmPassword?.message)}
          {...register('confirmPassword')}
        />
      </Field>
      {formError && (
        <p role="alert" className="text-body text-coral">
          {formError}
        </p>
      )}
      <Button type="submit" variant="brand" size="xl" className="mt-3 w-full" disabled={registerMutation.isPending}>
        {registerMutation.isPending ? 'Criando…' : submitLabel}
      </Button>
    </form>
  )
}
