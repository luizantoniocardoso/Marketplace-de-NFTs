import { useForm } from 'react-hook-form'
import { getApiError } from '@/shared/api'
import type { UserDto } from '@/shared/contracts'
import { standardResolver, useFormFields, useServerErrors } from '@/shared/lib'
import { Button, Field, FormError, PasswordInput, TextInput } from '@/shared/ui'
import { registerSchema, useRegister, type RegisterValues } from '../model'

interface RegisterFormProps {
  onSuccess?: (user: UserDto) => void
  submitLabel?: string
}

export function RegisterForm({ onSuccess, submitLabel = 'Criar conta' }: RegisterFormProps) {
  const registerMutation = useRegister()
  const form = useForm<RegisterValues>({
    resolver: standardResolver(registerSchema),
    defaultValues: { username: '', email: '', password: '', confirmPassword: '' },
  })
  const fields = useFormFields(form)
  const serverErrors = useServerErrors(form.setError, ['username', 'email', 'password'])
  const username = fields('username')
  const email = fields('email')
  const password = fields('password')
  const confirmPassword = fields('confirmPassword')

  const onSubmit = form.handleSubmit(({ username, email, password }) => {
    serverErrors.clear()
    registerMutation.mutate(
      { username, email, password },
      {
        onSuccess: (response) => onSuccess?.(response.user),
        onError: (error) => serverErrors.report(getApiError(error)),
      },
    )
  })

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-3">
      <Field {...username.field} label="Nome de usuário" hideLabel>
        <TextInput autoComplete="username" placeholder="Nome de usuário" {...username.control} />
      </Field>
      <Field {...email.field} label="E-mail" hideLabel>
        <TextInput type="email" autoComplete="email" placeholder="Digite seu e-mail" {...email.control} />
      </Field>
      <Field {...password.field} label="Senha" hideLabel>
        <PasswordInput autoComplete="new-password" placeholder="Senha" {...password.control} />
      </Field>
      <Field {...confirmPassword.field} label="Confirmar senha" hideLabel>
        <PasswordInput autoComplete="new-password" placeholder="Confirmar senha" {...confirmPassword.control} />
      </Field>
      {serverErrors.formError && <FormError>{serverErrors.formError}</FormError>}
      <Button type="submit" variant="brand" size="xl" className="mt-3 w-full" disabled={registerMutation.isPending}>
        {registerMutation.isPending ? 'Criando…' : submitLabel}
      </Button>
    </form>
  )
}
