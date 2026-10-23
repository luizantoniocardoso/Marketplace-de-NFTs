import { createFileRoute, redirect } from '@tanstack/react-router'
import { ensureSession } from '@/entities/session'
import { LoginPage } from '@/pages/login'
import { redirectSearchSchema } from '@/shared/lib'

export const Route = createFileRoute('/login')({
  staticData: { immersiveMobile: true },
  validateSearch: redirectSearchSchema,
  beforeLoad: async ({ context, search }) => {
    if (await ensureSession(context.queryClient)) throw redirect({ href: search.redirect ?? '/' })
  },
  component: LoginPage,
})
