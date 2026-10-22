import { QueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'

const MAX_RETRIES = 2

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: true,
      // Erros 4xx são definitivos; só falhas de rede e 5xx são repetidas.
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
