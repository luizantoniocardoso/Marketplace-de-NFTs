import { createFileRoute } from '@tanstack/react-router'
import { LoginPage } from '@/pages/login'
import { redirectSearchSchema } from '@/shared/lib'

export const Route = createFileRoute('/login')({
  validateSearch: redirectSearchSchema,
  component: LoginPage,
})
