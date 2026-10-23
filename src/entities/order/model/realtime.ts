import type { QueryClient } from '@tanstack/react-query'
import type { OrderDto, OrderUpdatedData } from '@/shared/contracts'
import { orderKeys } from '../api'

export function applyOrderUpdate(queryClient: QueryClient, viewerId: string, data: OrderUpdatedData, version: number) {
  if (data.userId !== viewerId) return false
  const key = orderKeys.detail(viewerId, data.orderId)
  const current = queryClient.getQueryData<OrderDto>(key)
  if (current && current.version >= version) return false
  if (current) queryClient.setQueryData<OrderDto>(key, { ...current, status: data.status, version })
  void queryClient.invalidateQueries({ queryKey: key })
  return true
}
