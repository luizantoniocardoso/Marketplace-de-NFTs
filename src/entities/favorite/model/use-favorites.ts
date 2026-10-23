import { useQuery } from '@tanstack/react-query'
import { useViewerId } from '@/shared/api'
import { favoriteQueries } from '../api'

export function useFavorites() {
  return useQuery(favoriteQueries.list(useViewerId()))
}

export function useIsFavorite(nftId: string) {
  const { data } = useFavorites()
  return data?.nftIds.includes(nftId) ?? false
}
