import { createFileRoute } from '@tanstack/react-router'
import { RegisterPage } from '@/pages/register'
import { redirectSearchSchema } from '@/shared/lib'

export const Route = createFileRoute('/register')({
  validateSearch: redirectSearchSchema,
  component: RegisterPage,
})
