import type { toSocketIo } from '@mswjs/socket.io-binding'
import {
  REALTIME_EVENTS,
  type NftUpdatedEvent,
  type OrderDto,
  type OrderUpdatedEvent,
  type RealtimeEvent,
} from '@/shared/contracts'
import type { MockNft } from '../fixtures'
import { nftAvailable, nftPrice } from './serializers'
import { userForToken } from './session'

type SocketIoConnection = ReturnType<typeof toSocketIo>

interface RealtimeClient {
  io: SocketIoConnection
  userId: string | null
  close: () => void
}

const clients = new Set<RealtimeClient>()
let eventSequence = 0
let lastEvent: { name: string; payload: RealtimeEvent<string, unknown>; userId: string | null } | null = null

export function registerClient(io: SocketIoConnection, close: () => void) {
  const client: RealtimeClient = { io, userId: null, close }
  clients.add(client)
  io.client.on(REALTIME_EVENTS.sessionJoin, (_event, payload: { token?: string }) => {
    client.userId = userForToken(payload?.token ?? null)?.id ?? null
  })
  io.client.on(REALTIME_EVENTS.sessionLeave, () => {
    client.userId = null
  })
  return () => clients.delete(client)
}

function nextEventId() {
  eventSequence += 1
  return `evt-${Date.now().toString(36)}-${eventSequence}`
}

function send(name: string, payload: RealtimeEvent<string, unknown>, userId: string | null) {
  lastEvent = { name, payload, userId }
  for (const client of clients) {
    if (userId && client.userId !== userId) continue
    client.io.client.emit(name, payload)
  }
}

export function emitNftUpdated(nft: MockNft, previousPriceEth: string | null = null) {
  const payload: NftUpdatedEvent = {
    eventId: nextEventId(),
    type: REALTIME_EVENTS.nftUpdated,
    resource: { type: 'nft', id: nft.id },
    version: nft.version,
    occurredAt: new Date().toISOString(),
    data: {
      nftId: nft.id,
      priceEth: nftPrice(nft),
      previousPriceEth,
      available: nftAvailable(nft),
      editions: nft.editions.map(({ id, priceEth, available }) => ({ id, priceEth, available })),
    },
  }
  send(REALTIME_EVENTS.nftUpdated, payload, null)
}

export function emitOrderUpdated(order: OrderDto & { userId: string }) {
  const payload: OrderUpdatedEvent = {
    eventId: nextEventId(),
    type: REALTIME_EVENTS.orderUpdated,
    resource: { type: 'order', id: order.id },
    version: order.version,
    occurredAt: new Date().toISOString(),
    data: { orderId: order.id, userId: order.userId, status: order.status },
  }
  send(REALTIME_EVENTS.orderUpdated, payload, order.userId)
}

export function replayLastEvent({ stale = false } = {}) {
  if (!lastEvent) return false
  const payload = stale
    ? { ...lastEvent.payload, eventId: nextEventId(), version: Math.max(0, lastEvent.payload.version - 1) }
    : lastEvent.payload
  send(lastEvent.name, payload, lastEvent.userId)
  return true
}

export function dropConnections() {
  for (const client of [...clients]) client.close()
}

export function connectedClients() {
  return clients.size
}
