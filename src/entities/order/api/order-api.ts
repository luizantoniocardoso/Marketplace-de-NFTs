import { queryOptions } from '@tanstack/react-query'
import { http, privateKey } from '@/shared/api'
import { API_HEADERS, type CreateOrderRequest, type OrderDto } from '@/shared/contracts'

const PENDING_POLL_MS = 5000

export async function createOrder(body: CreateOrderRequest, idempotencyKey: string) {
  const { data } = await http.post<OrderDto>('/orders', body, {
    headers: { [API_HEADERS.idempotencyKey]: idempotencyKey },
  })
  return data
}

export async function fetchOrder(orderId: string, signal?: AbortSignal) {
  const { data } = await http.get<OrderDto>(`/orders/${encodeURIComponent(orderId)}`, { signal })
  return data
}

export const orderKeys = {
  all: (viewerId: string | null) => privateKey(viewerId, 'orders'),
  detail: (viewerId: string | null, orderId: string) => [...orderKeys.all(viewerId), orderId] as const,
}

export const orderQueries = {
  detail: (viewerId: string | null, orderId: string) =>
    queryOptions({
      queryKey: orderKeys.detail(viewerId, orderId),
      queryFn: ({ signal }) => fetchOrder(orderId, signal),
      enabled: Boolean(viewerId),
      refetchInterval: (query) => (query.state.data?.status === 'pending' ? PENDING_POLL_MS : false),
    }),
}
