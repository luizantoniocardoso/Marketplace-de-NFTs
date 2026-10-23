import type { ReactNode } from 'react'
import { LoginForm } from '@/features/auth-login'
import { RegisterForm } from '@/features/auth-register'
import type { UserDto } from '@/shared/contracts'
import { DividerText } from '@/shared/ui'
import { AUTH_COPY, type AuthMode } from '../model'
import { AuthModeTabs } from './AuthModeTabs'
import { SocialAuthButtons } from './SocialAuthButtons'

interface AuthCardProps {
  mode: AuthMode
  onModeChange: (mode: AuthMode) => void
  onSuccess: (user: UserDto) => void
  notice?: ReactNode
}

export function AuthCard({ mode, onModeChange, onSuccess, notice }: AuthCardProps) {
  const copy = AUTH_COPY[mode]

  return (
    <div className="flex flex-col">
      <div className="pt-[42px]">
        <AuthModeTabs mode={mode} onModeChange={onModeChange} />
      </div>
      <p className="mx-auto mt-9 max-w-[400px] px-6 text-center text-caption leading-4 text-foreground">
        {copy.description}
      </p>
      <div className="mx-auto mt-6 w-full max-w-[340px] px-4 sm:px-0">
        {notice}
        {mode === 'login' ? <LoginForm onSuccess={onSuccess} /> : <RegisterForm onSuccess={onSuccess} />}
      </div>
      <DividerText className="mt-8">Ou continue com</DividerText>
      <SocialAuthButtons className="mx-auto mt-5 w-full max-w-[340px] px-4 pb-14 sm:px-0" />
    </div>
  )
}
