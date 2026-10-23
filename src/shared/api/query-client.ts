import { QueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'

const MAX_RETRIES = 2

export const PRIVATE_SCOPE = 'private'

export function privateKey(viewerId: string | null, ...parts: unknown[]) {
  return [PRIVATE_SCOPE, viewerId ?? 'anonymous', ...parts] as const
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: true,
      retry: (failureCount, error) => {
        if (isAxiosError(error) && error.response && error.response.status < 500) return false
        return failureCount < MAX_RETRIES
      },
    },
    mutations: {
      retry: false,
    },
  },
})
