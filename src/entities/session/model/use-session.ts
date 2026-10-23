import { useQuery } from '@tanstack/react-query'
import { useViewerId } from '@/shared/api'
import { sessionQueries } from '../api'

export function useSession() {
  const viewerId = useViewerId()
  const query = useQuery(sessionQueries.current(viewerId))
  const user = query.data?.user ?? null

  return {
    user,
    viewerId,
    isAuthenticated: Boolean(viewerId && user),
    isLoading: Boolean(viewerId) && query.isPending,
  }
}
