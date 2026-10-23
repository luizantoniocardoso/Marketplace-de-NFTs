import { useForm } from 'react-hook-form'
import { getApiError } from '@/shared/api'
import type { UserDto } from '@/shared/contracts'
import { standardResolver, useFormFields, useServerErrors } from '@/shared/lib'
import { Button, ComingSoon, Field, FormError, PasswordInput, TextInput } from '@/shared/ui'
import { loginSchema, useLogin, type LoginValues } from '../model'

interface LoginFormProps {
  onSuccess?: (user: UserDto) => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const loginMutation = useLogin()
  const form = useForm<LoginValues>({
    resolver: standardResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })
  const fields = useFormFields(form)
  const serverErrors = useServerErrors(form.setError, ['email', 'password'])
  const email = fields('email')
  const password = fields('password')

  const onSubmit = form.handleSubmit((values) => {
    serverErrors.clear()
    loginMutation.mutate(values, {
      onSuccess: (response) => onSuccess?.(response.user),
      onError: (error) => serverErrors.report(getApiError(error)),
    })
  })

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-3">
      <Field {...email.field} label="E-mail" hideLabel>
        <TextInput type="email" autoComplete="email" placeholder="contato@email.com" {...email.control} />
      </Field>
      <Field {...password.field} label="Senha" hideLabel>
        <PasswordInput autoComplete="current-password" placeholder="Senha" {...password.control} />
      </Field>
      <ComingSoon className="self-end text-body text-text-accent">Esqueceu a senha?</ComingSoon>
      {serverErrors.formError && <FormError>{serverErrors.formError}</FormError>}
      <Button type="submit" variant="brand" size="xl" className="mt-4 w-full" disabled={loginMutation.isPending}>
        {loginMutation.isPending ? 'Entrando…' : 'Entrar'}
      </Button>
    </form>
  )
}
