import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { acknowledgeCartChanges, cartKeys, removeCartItem, storeCart, updateCartItem } from '@/entities/cart'
import { getApiError, useViewerId } from '@/shared/api'
import type { CartDto, CartItemDto } from '@/shared/contracts'
import { multiplyEth } from '@/shared/lib'

function useCartCache() {
  const queryClient = useQueryClient()
  const viewerId = useViewerId()
  const key = cartKeys.detail(viewerId)

  const patch = async (update: (cart: CartDto) => CartDto) => {
    await queryClient.cancelQueries({ queryKey: key })
    const previous = queryClient.getQueryData<CartDto>(key)
    if (previous) queryClient.setQueryData<CartDto>(key, update(previous))
    return { previous }
  }

  return {
    patch,
    rollback: (context?: { previous?: CartDto }) => queryClient.setQueryData(key, context?.previous),
    store: (cart: CartDto) => storeCart(queryClient, viewerId, cart),
  }
}

export function useUpdateCartItem() {
  const cache = useCartCache()

  return useMutation({
    mutationFn: ({ item, quantity }: { item: CartItemDto; quantity: number }) => updateCartItem(item.id, { quantity }),
    onMutate: ({ item, quantity }) =>
      cache.patch((cart) => {
        const items = cart.items.map((entry) =>
          entry.id === item.id
            ? { ...entry, quantity, lineTotalEth: multiplyEth(entry.unitPriceEth, quantity) }
            : entry,
        )
        return { ...cart, items, itemCount: items.reduce((sum, entry) => sum + entry.quantity, 0) }
      }),
    onError: (error, _variables, context) => {
      cache.rollback(context)
      toast.error(getApiError(error).message)
    },
    onSuccess: cache.store,
  })
}

export function useRemoveCartItem() {
  const cache = useCartCache()

  return useMutation({
    mutationFn: (item: CartItemDto) => removeCartItem(item.id),
    onMutate: (item) =>
      cache.patch((cart) => {
        const items = cart.items.filter((entry) => entry.id !== item.id)
        return { ...cart, items, itemCount: items.reduce((sum, entry) => sum + entry.quantity, 0) }
      }),
    onError: (error, _item, context) => {
      cache.rollback(context)
      toast.error(getApiError(error).message)
    },
    onSuccess: (cart, item) => {
      toast.success(`${item.name} foi removido do carrinho.`)
      return cache.store(cart)
    },
  })
}

export function useAcknowledgeCartChanges() {
  const cache = useCartCache()

  return useMutation({
    mutationFn: acknowledgeCartChanges,
    onSuccess: cache.store,
    onError: (error) => toast.error(getApiError(error).message),
  })
}
