import { queryOptions } from '@tanstack/react-query'
import { http, privateKey } from '@/shared/api'
import type { FavoritesDto } from '@/shared/contracts'

export async function fetchFavorites(signal?: AbortSignal) {
  const { data } = await http.get<FavoritesDto>('/favorites', { signal })
  return data
}

export async function addFavorite(nftId: string) {
  await http.put(`/favorites/${encodeURIComponent(nftId)}`)
}

export async function removeFavorite(nftId: string) {
  await http.delete(`/favorites/${encodeURIComponent(nftId)}`)
}

export const favoriteKeys = {
  list: (viewerId: string | null) => privateKey(viewerId, 'favorites'),
}

export const favoriteQueries = {
  list: (viewerId: string | null) =>
    queryOptions({
      queryKey: favoriteKeys.list(viewerId),
      queryFn: ({ signal }) => fetchFavorites(signal),
      enabled: Boolean(viewerId),
    }),
}
