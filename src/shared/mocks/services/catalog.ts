import { toEthString, parseEth } from '@/shared/lib'
import { db } from '../db'
import { emitNftUpdated } from './realtime'
import { findEdition, findNft, nftPrice } from './serializers'

export interface EditionPatch {
  priceEth?: string
  available?: number
  availableDelta?: number
}

export function updateEditions(nftId: string, patches: Record<string, EditionPatch>) {
  const nft = findNft(nftId)
  if (!nft) return null
  const previousPrice = nftPrice(nft)
  for (const [editionId, patch] of Object.entries(patches)) {
    const edition = findEdition(nft, editionId)
    if (!edition) continue
    if (patch.priceEth !== undefined) edition.priceEth = patch.priceEth
    if (patch.available !== undefined) edition.available = Math.max(0, patch.available)
    if (patch.availableDelta !== undefined) edition.available = Math.max(0, edition.available + patch.availableDelta)
  }
  nft.version += 1
  db.persist()
  emitNftUpdated(nft, previousPrice !== nftPrice(nft) ? previousPrice : null)
  return nft
}

export function raisePrice(nftId: string, editionId: string, percent: number) {
  const edition = findNft(nftId)?.editions.find((item) => item.id === editionId)
  if (!edition) return null
  const raised = (parseEth(edition.priceEth) * BigInt(100 + percent)) / 100n
  const rounded = (raised / 10n ** 16n) * 10n ** 16n
  return updateEditions(nftId, { [editionId]: { priceEth: toEthString(rounded) } })
}
