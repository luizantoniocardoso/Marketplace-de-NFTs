import { useQuery } from '@tanstack/react-query'
import { useViewerId } from '@/shared/api'
import { orderQueries } from '../api'

export function useOrder(orderId: string) {
  return useQuery(orderQueries.detail(useViewerId(), orderId))
}
