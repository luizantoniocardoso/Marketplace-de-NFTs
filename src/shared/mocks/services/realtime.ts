import type { toSocketIo } from '@mswjs/socket.io-binding'
import {
  REALTIME_EVENTS,
  type NftUpdatedEvent,
  type OrderDto,
  type OrderUpdatedEvent,
  type RealtimeEvent,
  type SessionJoinPayload,
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
interface SentEvent {
  name: string
  payload: RealtimeEvent<string, unknown>
  userId: string | null
}

const HISTORY_LIMIT = 50
const history: SentEvent[] = []

export function registerClient(io: SocketIoConnection, close: () => void) {
  const client: RealtimeClient = { io, userId: null, close }
  clients.add(client)
  io.client.on(REALTIME_EVENTS.sessionJoin, (_event, payload: Partial<SessionJoinPayload> | undefined) => {
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

function deliver({ name, payload, userId }: SentEvent) {
  for (const client of clients) {
    if (userId && client.userId !== userId) continue
    client.io.client.emit(name, payload)
  }
}

function send(name: string, payload: RealtimeEvent<string, unknown>, userId: string | null) {
  history.push({ name, payload, userId })
  if (history.length > HISTORY_LIMIT) history.shift()
  deliver({ name, payload, userId })
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
  const last = history.at(-1)
  if (!last) return false
  if (!stale) {
    deliver(last)
    return true
  }
  const previous = history
    .slice(0, -1)
    .findLast((event) => event.name === last.name && event.payload.resource.id === last.payload.resource.id)
  const outdated = previous ?? { ...last, payload: { ...last.payload, version: Math.max(0, last.payload.version - 1) } }
  deliver({ ...outdated, payload: { ...outdated.payload, eventId: nextEventId() } })
  return true
}

export function dropConnections() {
  for (const client of [...clients]) client.close()
}
