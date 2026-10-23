import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { endSession } from '@/entities/session'
import { onAuthFailure, viewer } from '@/shared/api'

const PRIVATE_ROUTE_PREFIX = '/_authenticated'

export function SessionExpiryHandler() {
  const queryClient = useQueryClient()
  const router = useRouter()

  useEffect(
    () =>
      onAuthFailure((code) => {
        if (!viewer.getId()) return
        endSession(queryClient)
        toast.error(
          code === 'SESSION_EXPIRED'
            ? 'Sua sessão expirou. Entre novamente para continuar.'
            : 'Sua sessão não é mais válida.',
        )
        const { matches, location } = router.state
        if (matches.some((match) => match.routeId.startsWith(PRIVATE_ROUTE_PREFIX))) {
          void router.navigate({ to: '/login', search: { redirect: location.href, reason: 'expired' } })
        }
      }),
    [queryClient, router],
  )

  return null
}
