import { http } from '@/shared/api'
import type {
  AddCartItemRequest,
  ApplyCouponRequest,
  CartDto,
  QuoteDto,
  UpdateCartItemRequest,
} from '@/shared/contracts'

export async function fetchCart(signal?: AbortSignal) {
  const { data } = await http.get<CartDto>('/cart', { signal })
  return data
}

export async function fetchQuote(signal?: AbortSignal) {
  const { data } = await http.get<QuoteDto>('/cart/quote', { signal })
  return data
}

export async function addCartItem(body: AddCartItemRequest) {
  const { data } = await http.post<CartDto>('/cart/items', body)
  return data
}

export async function updateCartItem(itemId: string, body: UpdateCartItemRequest) {
  const { data } = await http.patch<CartDto>(`/cart/items/${encodeURIComponent(itemId)}`, body)
  return data
}

export async function removeCartItem(itemId: string) {
  const { data } = await http.delete<CartDto>(`/cart/items/${encodeURIComponent(itemId)}`)
  return data
}

export async function acknowledgeCartChanges() {
  const { data } = await http.post<CartDto>('/cart/acknowledge')
  return data
}

export async function applyCoupon(body: ApplyCouponRequest) {
  const { data } = await http.put<CartDto>('/cart/coupon', body)
  return data
}

export async function removeCoupon() {
  const { data } = await http.delete<CartDto>('/cart/coupon')
  return data
}
