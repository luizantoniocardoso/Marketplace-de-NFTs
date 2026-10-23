import { getRouteApi, Link, useNavigate } from '@tanstack/react-router'
import { AuthScreen } from '@/widgets/auth-card'
import { SessionNotice } from './SessionNotice'

const route = getRouteApi('/login')

export function LoginPage() {
  const { redirect, reason } = route.useSearch()
  const navigate = useNavigate()

  return (
    <AuthScreen
      mode="login"
      onModeChange={(mode) => mode === 'register' && void navigate({ to: '/register', search: { redirect } })}
      onSuccess={() => void navigate({ href: redirect ?? '/', replace: true })}
      onClose={() => void navigate({ to: '/' })}
      notice={reason === 'expired' ? <SessionNotice /> : null}
      switchLink={
        <>
          Novo na Kurio?{' '}
          <Link to="/register" search={{ redirect }} className="text-text-accent underline-offset-4 hover:underline">
            Crie uma conta
          </Link>
        </>
      }
    />
  )
}
