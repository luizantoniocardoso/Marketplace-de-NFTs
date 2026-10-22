import { createFileRoute } from '@tanstack/react-router'
import { RegisterPage } from '@/pages/register'

interface AuthSearch {
  redirect?: string
}

export const Route = createFileRoute('/register')({
  validateSearch: (search: Record<string, unknown>): AuthSearch => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
  component: RegisterPage,
})
