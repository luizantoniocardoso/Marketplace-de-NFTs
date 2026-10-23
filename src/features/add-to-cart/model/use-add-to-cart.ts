import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addCartItem, storeCart } from '@/entities/cart'
import { useViewerId } from '@/shared/api'

export function useAddToCart() {
  const queryClient = useQueryClient()
  const viewerId = useViewerId()

  return useMutation({
    mutationFn: addCartItem,
    onSuccess: (cart) => storeCart(queryClient, viewerId, cart),
  })
}
