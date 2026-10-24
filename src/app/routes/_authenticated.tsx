import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { ensureSession } from '@/entities/session'
import { viewer } from '@/shared/api'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context, location }) => {
    const hadSession = Boolean(viewer.getId())
    const session = await ensureSession(context.queryClient)
    if (!session) {
      const expired = hadSession || viewer.wasExpired()
      throw redirect({
        to: '/login',
        search: { redirect: location.href, ...(expired ? { reason: 'expired' as const } : {}) },
      })
    }
    return { user: session.user }
  },
  component: Outlet,
})
