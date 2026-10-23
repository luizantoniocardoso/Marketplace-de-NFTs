import { useQuery } from '@tanstack/react-query'
import { useViewerId } from '@/shared/api'
import { cartQueries } from '../api'

export function useCart() {
  return useQuery(cartQueries.detail(useViewerId()))
}

export function useCartQuote({ enabled = true } = {}) {
  return useQuery({ ...cartQueries.quote(useViewerId()), enabled })
}

export function useCartCount() {
  const { data } = useCart()
  return data?.itemCount ?? 0
}
