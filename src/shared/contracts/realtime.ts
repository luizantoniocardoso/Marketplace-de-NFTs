import type { OrderStatus } from './order'

export const REALTIME_EVENTS = {
  nftUpdated: 'nft.updated',
  orderUpdated: 'order.updated',
  sessionJoin: 'session.join',
  sessionLeave: 'session.leave',
} as const

export interface RealtimeEvent<TType extends string, TData> {
  eventId: string
  type: TType
  resource: { type: 'nft' | 'order'; id: string }
  version: number
  occurredAt: string
  data: TData
}

export interface NftUpdatedData {
  nftId: string
  priceEth: string
  previousPriceEth: string | null
  available: number
  editions: Array<{ id: string; priceEth: string; available: number }>
}

export interface OrderUpdatedData {
  orderId: string
  userId: string
  status: OrderStatus
}

export type NftUpdatedEvent = RealtimeEvent<typeof REALTIME_EVENTS.nftUpdated, NftUpdatedData>
export type OrderUpdatedEvent = RealtimeEvent<typeof REALTIME_EVENTS.orderUpdated, OrderUpdatedData>

export interface SessionJoinPayload {
  token: string
}
