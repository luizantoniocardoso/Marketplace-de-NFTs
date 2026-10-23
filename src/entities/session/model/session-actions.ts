import type { QueryClient } from '@tanstack/react-query'
import { PRIVATE_SCOPE, syncSocketSession, viewer } from '@/shared/api'
import type { AuthResponse, SessionDto, UserDto } from '@/shared/contracts'
import { sessionKeys, sessionQueries } from '../api'

export function startSession(queryClient: QueryClient, response: AuthResponse) {
  queryClient.removeQueries({ queryKey: [PRIVATE_SCOPE] })
  viewer.signIn(response.token, response.user.id)
  const session: SessionDto = { user: response.user, expiresAt: response.expiresAt }
  queryClient.setQueryData(sessionKeys.current(response.user.id), session)
  syncSocketSession()
  void queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] !== sessionKeys.all[0] })
}

export function endSession(queryClient: QueryClient) {
  viewer.signOut()
  syncSocketSession()
  queryClient.removeQueries({ queryKey: [PRIVATE_SCOPE] })
  queryClient.removeQueries({ queryKey: sessionKeys.all })
  void queryClient.invalidateQueries()
}

export function updateSessionUser(queryClient: QueryClient, user: UserDto) {
  queryClient.setQueryData<SessionDto | null>(sessionKeys.current(user.id), (current) =>
    current ? { ...current, user } : current,
  )
}

export async function ensureSession(queryClient: QueryClient) {
  const viewerId = viewer.getId()
  if (!viewerId) return null
  try {
    return await queryClient.ensureQueryData(sessionQueries.current(viewerId))
  } catch {
    return null
  }
}
