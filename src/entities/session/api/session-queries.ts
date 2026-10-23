import { queryOptions } from '@tanstack/react-query'
import { isApiError } from '@/shared/api'
import type { SessionDto } from '@/shared/contracts'
import { fetchSession } from './session-api'

const SESSION_STALE_TIME = 5 * 60_000

export const sessionKeys = {
  all: ['session'] as const,
  current: (viewerId: string | null) => [...sessionKeys.all, viewerId ?? 'anonymous'] as const,
}

export const sessionQueries = {
  current: (viewerId: string | null) =>
    queryOptions({
      queryKey: sessionKeys.current(viewerId),
      queryFn: async ({ signal }): Promise<SessionDto | null> => {
        if (!viewerId) return null
        try {
          return await fetchSession(signal)
        } catch (error) {
          if (isApiError(error, 'UNAUTHENTICATED', 'SESSION_EXPIRED')) return null
          throw error
        }
      },
      staleTime: SESSION_STALE_TIME,
    }),
}
