import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cartKeys } from '@/entities/cart'
import { createOrder, orderKeys } from '@/entities/order'
import { isApiError, isTimeoutError, useViewerId } from '@/shared/api'
import type { CreateOrderRequest, OrderDto } from '@/shared/contracts'
import { idempotencyKeyFor } from './attempt-key'

const MAX_TIMEOUT_RETRIES = 2

export function usePlaceOrder({ onPlaced }: { onPlaced?: (order: OrderDto) => void } = {}) {
  const queryClient = useQueryClient()
  const viewerId = useViewerId()

  return useMutation({
    mutationKey: ['place-order'],
    mutationFn: (body: CreateOrderRequest) => createOrder(body, idempotencyKeyFor(body)),
    retry: (failureCount, error) => isTimeoutError(error) && failureCount < MAX_TIMEOUT_RETRIES,
    retryDelay: 300,
    onSuccess: (order) => {
      queryClient.setQueryData(orderKeys.detail(viewerId, order.id), order)
      onPlaced?.(order)
    },
    onError: (error) => {
      if (isApiError(error, 'QUOTE_OUTDATED', 'OUT_OF_STOCK')) {
        void queryClient.invalidateQueries({ queryKey: cartKeys.root(viewerId) })
      }
    },
  })
}
