import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { cartKeys } from '@/entities/cart'
import { applyNftUpdate, nftKeys } from '@/entities/nft'
import { applyOrderUpdate, orderKeys } from '@/entities/order'
import { loadSocket, viewer, whenApiReady } from '@/shared/api'
import { REALTIME_EVENTS, type CartDto, type NftUpdatedEvent, type OrderUpdatedEvent } from '@/shared/contracts'
import { compareEth, formatEth } from '@/shared/lib'

const SEEN_EVENTS_LIMIT = 200

function createEventLog() {
  const seen = new Set<string>()
  return (eventId: string) => {
    if (seen.has(eventId)) return false
    seen.add(eventId)
    if (seen.size > SEEN_EVENTS_LIMIT) seen.delete(seen.values().next().value!)
    return true
  }
}

function describeCartChange(cart: CartDto | undefined, event: NftUpdatedEvent) {
  return (cart?.items ?? []).flatMap((item) => {
    if (item.nftId !== event.data.nftId) return []
    const edition = event.data.editions.find((entry) => entry.id === item.editionId)
    if (!edition) return []
    if (edition.available === 0) return [`${item.name} (${item.editionLabel}) esgotou.`]
    if (edition.available < item.quantity) return [`Restam apenas ${edition.available} unidades de ${item.name}.`]
    if (compareEth(edition.priceEth, item.unitPriceEth) !== 0) {
      return [`O preço de ${item.name} mudou para ${formatEth(edition.priceEth)}.`]
    }
    return []
  })
}

export function RealtimeBridge() {
  const queryClient = useQueryClient()

  useEffect(() => {
    let cancelled = false
    let release = () => {}
    const isNew = createEventLog()
    let connectedBefore = false

    const onNftUpdated = (event: NftUpdatedEvent) => {
      if (!isNew(event.eventId)) return
      applyNftUpdate(queryClient, event.data, event.version)
      const viewerId = viewer.getId()
      const cart = queryClient.getQueryData<CartDto>(cartKeys.detail(viewerId))
      if (!cart?.items.some((item) => item.nftId === event.data.nftId)) return
      describeCartChange(cart, event).forEach((message) => toast.info(message, { id: `cart-${event.data.nftId}` }))
      void queryClient.invalidateQueries({ queryKey: cartKeys.root(viewerId) })
    }

    const onOrderUpdated = (event: OrderUpdatedEvent) => {
      if (!isNew(event.eventId)) return
      const viewerId = viewer.getId()
      if (!viewerId || !applyOrderUpdate(queryClient, viewerId, event.data, event.version)) return
      if (event.data.status === 'confirmed') {
        void queryClient.invalidateQueries({ queryKey: cartKeys.root(viewerId) })
      }
    }

    const onConnect = () => {
      if (connectedBefore) {
        const viewerId = viewer.getId()
        void queryClient.invalidateQueries({ queryKey: nftKeys.all })
        void queryClient.invalidateQueries({ queryKey: cartKeys.root(viewerId) })
        void queryClient.invalidateQueries({ queryKey: orderKeys.all(viewerId) })
      }
      connectedBefore = true
    }

    void whenApiReady()
      .then(loadSocket)
      .then((socket) => {
        if (cancelled) return
        socket.on('connect', onConnect)
        socket.on(REALTIME_EVENTS.nftUpdated, onNftUpdated)
        socket.on(REALTIME_EVENTS.orderUpdated, onOrderUpdated)
        socket.connect()
        release = () => {
          socket.off('connect', onConnect)
          socket.off(REALTIME_EVENTS.nftUpdated, onNftUpdated)
          socket.off(REALTIME_EVENTS.orderUpdated, onOrderUpdated)
          socket.disconnect()
        }
      })

    return () => {
      cancelled = true
      release()
    }
  }, [queryClient])

  return null
}
