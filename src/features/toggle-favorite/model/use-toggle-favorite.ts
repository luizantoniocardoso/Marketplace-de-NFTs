import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { addFavorite, favoriteKeys, removeFavorite } from '@/entities/favorite'
import { getApiError, useViewerId } from '@/shared/api'
import type { FavoritesDto } from '@/shared/contracts'

interface ToggleFavoriteVariables {
  nftId: string
  nftName: string
  favorite: boolean
}

export function useToggleFavorite() {
  const queryClient = useQueryClient()
  const viewerId = useViewerId()
  const key = favoriteKeys.list(viewerId)

  return useMutation({
    mutationKey: ['toggle-favorite'],
    mutationFn: ({ nftId, favorite }: ToggleFavoriteVariables) =>
      favorite ? addFavorite(nftId) : removeFavorite(nftId),
    onMutate: async ({ nftId, favorite }) => {
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<FavoritesDto>(key)
      queryClient.setQueryData<FavoritesDto>(key, (current) => {
        const ids = current?.nftIds ?? []
        return { nftIds: favorite ? [...new Set([...ids, nftId])] : ids.filter((id) => id !== nftId) }
      })
      return { previous }
    },
    onError: (error, { nftName, favorite }, context) => {
      queryClient.setQueryData(key, context?.previous)
      const action = favorite ? 'adicionar' : 'remover'
      toast.error(`Não foi possível ${action} ${nftName} dos favoritos.`, { description: getApiError(error).message })
    },
    onSuccess: (_data, { nftName, favorite }) => {
      toast.success(favorite ? `${nftName} foi adicionado aos favoritos.` : `${nftName} foi removido dos favoritos.`)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
  })
}
