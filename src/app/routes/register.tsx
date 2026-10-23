import { createFileRoute, redirect } from '@tanstack/react-router'
import { ensureSession } from '@/entities/session'
import { RegisterPage } from '@/pages/register'
import { redirectSearchSchema } from '@/shared/lib'

export const Route = createFileRoute('/register')({
  staticData: { immersiveMobile: true },
  validateSearch: redirectSearchSchema,
  beforeLoad: async ({ context, search }) => {
    if (await ensureSession(context.queryClient)) throw redirect({ href: search.redirect ?? '/' })
  },
  component: RegisterPage,
})
