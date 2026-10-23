import { useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { getApiError } from '@/shared/api'
import type { UserDto } from '@/shared/contracts'
import { applyFieldErrors, standardResolver } from '@/shared/lib'
import { Button, ComingSoon, Field, fieldDescribedBy, PasswordInput, TextInput } from '@/shared/ui'
import { loginSchema, useLogin, type LoginValues } from '../model'

interface LoginFormProps {
  onSuccess?: (user: UserDto) => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const id = useId()
  const [formError, setFormError] = useState<string>()
  const loginMutation = useLogin()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: standardResolver(loginSchema), defaultValues: { email: '', password: '' } })

  const onSubmit = handleSubmit((values) => {
    setFormError(undefined)
    loginMutation.mutate(values, {
      onSuccess: (response) => onSuccess?.(response.user),
      onError: (error) => {
        const apiError = getApiError(error)
        if (!applyFieldErrors(setError, apiError.fields, ['email', 'password'])) setFormError(apiError.message)
      },
    })
  })

  const emailId = `${id}-email`
  const passwordId = `${id}-password`

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-3" aria-describedby={formError ? `${id}-error` : undefined}>
      <Field id={emailId} label="E-mail" hideLabel error={errors.email?.message}>
        <TextInput
          id={emailId}
          type="email"
          autoComplete="email"
          placeholder="contato@email.com"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={fieldDescribedBy(emailId, errors.email?.message)}
          {...register('email')}
        />
      </Field>
      <Field id={passwordId} label="Senha" hideLabel error={errors.password?.message}>
        <PasswordInput
          id={passwordId}
          autoComplete="current-password"
          placeholder="Senha"
          aria-invalid={errors.password ? true : undefined}
          aria-describedby={fieldDescribedBy(passwordId, errors.password?.message)}
          {...register('password')}
        />
      </Field>
      <ComingSoon className="self-end text-body text-text-accent">Esqueceu a senha?</ComingSoon>
      {formError && (
        <p id={`${id}-error`} role="alert" className="text-body text-coral">
          {formError}
        </p>
      )}
      <Button type="submit" variant="brand" size="xl" className="mt-4 w-full" disabled={loginMutation.isPending}>
        {loginMutation.isPending ? 'Entrando…' : 'Entrar'}
      </Button>
    </form>
  )
}
