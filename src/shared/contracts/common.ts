export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHENTICATED'
  | 'SESSION_EXPIRED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'OUT_OF_STOCK'
  | 'COUPON_INVALID'
  | 'COUPON_EXPIRED'
  | 'QUOTE_OUTDATED'
  | 'IDEMPOTENCY_CONFLICT'
  | 'WALLET_REJECTED'
  | 'UNAVAILABLE'
  | 'INTERNAL_ERROR'

export interface ApiErrorBody {
  error: {
    code: ApiErrorCode
    message: string
    fields?: Record<string, string>
  }
}

export interface Paginated<T> {
  items: T[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface NewsletterSubscribeRequest {
  email: string
}

export const API_HEADERS = {
  authorization: 'Authorization',
  cartId: 'X-Cart-Id',
  idempotencyKey: 'Idempotency-Key',
} as const
