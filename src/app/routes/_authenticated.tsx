import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { ensureSession } from '@/entities/session'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context, location }) => {
    const session = await ensureSession(context.queryClient)
    if (!session) throw redirect({ to: '/login', search: { redirect: location.href } })
    return { user: session.user }
  },
  component: Outlet,
})
