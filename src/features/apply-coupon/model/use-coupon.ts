import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { applyCoupon, removeCoupon, storeCart } from '@/entities/cart'
import { useViewerId } from '@/shared/api'

export function useApplyCoupon() {
  const queryClient = useQueryClient()
  const viewerId = useViewerId()

  return useMutation({
    mutationFn: (code: string) => applyCoupon({ code }),
    onSuccess: (cart) => {
      toast.success(`Cupom ${cart.coupon?.code ?? ''} aplicado.`)
      return storeCart(queryClient, viewerId, cart)
    },
  })
}

export function useRemoveCoupon() {
  const queryClient = useQueryClient()
  const viewerId = useViewerId()

  return useMutation({
    mutationFn: removeCoupon,
    onSuccess: (cart) => storeCart(queryClient, viewerId, cart),
  })
}
