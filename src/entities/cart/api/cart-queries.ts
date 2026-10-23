import { queryOptions, type QueryClient } from '@tanstack/react-query'
import { privateKey } from '@/shared/api'
import type { CartDto } from '@/shared/contracts'
import { fetchCart, fetchQuote } from './cart-api'

export const cartKeys = {
  root: (viewerId: string | null) => privateKey(viewerId, 'cart'),
  detail: (viewerId: string | null) => [...cartKeys.root(viewerId), 'detail'] as const,
  quote: (viewerId: string | null) => [...cartKeys.root(viewerId), 'quote'] as const,
}

export const cartQueries = {
  detail: (viewerId: string | null) =>
    queryOptions({
      queryKey: cartKeys.detail(viewerId),
      queryFn: ({ signal }) => fetchCart(signal),
    }),
  quote: (viewerId: string | null) =>
    queryOptions({
      queryKey: cartKeys.quote(viewerId),
      queryFn: ({ signal }) => fetchQuote(signal),
      staleTime: 0,
    }),
}

export function storeCart(queryClient: QueryClient, viewerId: string | null, cart: CartDto) {
  queryClient.setQueryData(cartKeys.detail(viewerId), cart)
  return queryClient.invalidateQueries({ queryKey: cartKeys.quote(viewerId) })
}
