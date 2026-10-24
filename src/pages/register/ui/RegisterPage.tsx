import { getRouteApi, Link, useNavigate } from '@tanstack/react-router'
import { useDocumentTitle } from '@/shared/lib'
import { AuthScreen } from '@/widgets/auth-card'

const route = getRouteApi('/register')

export function RegisterPage() {
  useDocumentTitle('Criar conta')
  const { redirect } = route.useSearch()
  const navigate = useNavigate()

  return (
    <AuthScreen
      mode="register"
      onModeChange={(mode) => mode === 'login' && void navigate({ to: '/login', search: { redirect } })}
      onSuccess={() => void navigate({ href: redirect ?? '/', replace: true })}
      onClose={() => void navigate({ to: '/' })}
      switchLink={
        <>
          Já tem uma conta?{' '}
          <Link to="/login" search={{ redirect }} className="text-text-accent underline-offset-4 hover:underline">
            Entre
          </Link>
        </>
      }
    />
  )
}
