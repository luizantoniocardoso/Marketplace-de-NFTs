import { Link } from '@tanstack/react-router'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { LoginForm } from '@/features/auth-login'
import { RegisterForm } from '@/features/auth-register'
import type { UserDto } from '@/shared/contracts'
import { DividerText, Logo } from '@/shared/ui'
import { AUTH_COPY, type AuthMode } from '../model'
import { AuthModeTabs } from './AuthModeTabs'
import { SocialAuthButtons } from './SocialAuthButtons'

interface AuthScreenProps {
  mode: AuthMode
  onModeChange: (mode: AuthMode) => void
  onSuccess: (user: UserDto) => void
  onClose: () => void
  notice?: ReactNode
  switchLink: ReactNode
}

const mobileControls =
  'max-md:[&_[data-slot=text-input]]:h-[50px] max-md:[&_[data-slot=text-input]]:rounded-[10px] max-md:[&_[data-slot=text-input]]:border-border-soft max-md:[&_button[type=submit]]:h-[60px] max-md:[&_button[type=submit]]:rounded-[10px]'

export function AuthScreen({ mode, onModeChange, onSuccess, onClose, notice, switchLink }: AuthScreenProps) {
  const copy = AUTH_COPY[mode]

  return (
    <div className="md:grid md:min-h-[calc(100dvh-68px)] md:place-items-center md:bg-ink/70 md:px-6 md:py-16">
      <section
        aria-labelledby="auth-title"
        className="relative flex min-h-dvh w-full flex-col px-7 pt-[120px] pb-8 md:min-h-0 md:max-w-[500px] md:bg-surface-card md:px-0 md:pt-0 md:pb-0 md:shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-3 right-3 hidden size-8 place-items-center text-brand hover:text-brand-light md:grid"
        >
          <X className="size-5" aria-hidden="true" />
        </button>

        <Link
          to="/"
          aria-label="Kurio, página inicial"
          className="mx-auto text-[32px] leading-10 text-foreground md:hidden"
        >
          <Logo />
        </Link>
        <h1 id="auth-title" className="mt-[86px] text-center text-title font-bold text-foreground md:sr-only">
          {copy.title}
        </h1>
        <div className="hidden pt-[42px] md:block">
          <AuthModeTabs mode={mode} onModeChange={onModeChange} />
        </div>
        <p className="mx-auto mt-9 hidden max-w-[400px] px-6 text-center text-caption leading-4 text-foreground md:block">
          {copy.description}
        </p>

        <div className={`mx-auto mt-8 w-full md:mt-6 md:max-w-[340px] ${mobileControls}`}>
          {notice}
          {mode === 'login' ? (
            <LoginForm onSuccess={onSuccess} />
          ) : (
            <RegisterForm onSuccess={onSuccess} submitLabel="Criar conta" />
          )}
        </div>

        <DividerText className="mt-12 md:mt-8">Ou continue com</DividerText>
        <SocialAuthButtons className="mx-auto mt-4 w-full md:mt-5 md:max-w-[340px] md:pb-14" />
        <p className="mt-12 text-center text-body text-text-secondary md:hidden">{switchLink}</p>
        <div aria-hidden="true" className="hidden h-2.5 bg-brand md:block" />
      </section>
    </div>
  )
}
