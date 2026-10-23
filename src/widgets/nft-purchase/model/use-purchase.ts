import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { editionLimit, pickInitialEdition } from '@/entities/nft'
import { useAddToCart } from '@/features/add-to-cart'
import { getApiError } from '@/shared/api'
import type { NftDetailDto } from '@/shared/contracts'

export function usePurchase(nft: NftDetailDto) {
  const navigate = useNavigate()
  const addToCart = useAddToCart()
  const [editionId, setEditionId] = useState(() => pickInitialEdition(nft.editions, nft.defaultEditionId).id)
  const [requested, setRequested] = useState(1)

  const edition = nft.editions.find((item) => item.id === editionId) ?? nft.editions[0]
  const max = editionLimit(edition)
  const quantity = Math.max(1, Math.min(requested, max || 1))
  const soldOut = edition.available === 0

  const selectEdition = (id: string) => {
    setEditionId(id)
    setRequested(1)
  }

  const add = (then: 'cart' | 'stay') =>
    addToCart.mutate(
      { nftId: nft.id, editionId: edition.id, quantity },
      {
        onSuccess: () => {
          if (then === 'cart') {
            void navigate({ to: '/cart' })
            return
          }
          toast.success(`${nft.name} (${edition.label}) foi adicionado ao carrinho.`, {
            action: { label: 'Ver carrinho', onClick: () => void navigate({ to: '/cart' }) },
          })
        },
        onError: (error) => toast.error(getApiError(error).message),
      },
    )

  return {
    edition,
    quantity,
    max,
    soldOut,
    isAdding: addToCart.isPending,
    selectEdition,
    setQuantity: setRequested,
    buyNow: () => add('cart'),
    addToCart: () => add('stay'),
  }
}

export type PurchaseState = ReturnType<typeof usePurchase>
