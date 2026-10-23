import type { NftSummaryDto } from '@/shared/contracts'
import { compareEth } from '@/shared/lib'
import { ARTWORKS, type MockNft } from '../fixtures'

export function nftPrice(nft: MockNft): string {
  const inStock = nft.editions.filter((e) => e.available > 0)
  const pool = inStock.length ? inStock : nft.editions
  return pool.reduce((min, e) => (compareEth(e.priceEth, min) < 0 ? e.priceEth : min), pool[0].priceEth)
}

export function toNftSummary(nft: MockNft): NftSummaryDto {
  return {
    id: nft.id,
    name: nft.name,
    collection: nft.collection,
    network: nft.network,
    priceEth: nftPrice(nft),
    previousPriceEth: nft.previousPriceEth,
    rarity: nft.rarity,
    image: {
      small: `/images/nfts/${nft.artwork}-480.webp`,
      large: `/images/nfts/${nft.artwork}-960.webp`,
      alt: `${nft.name}: ${ARTWORKS[nft.artwork]}`,
    },
    available: nft.editions.reduce((sum, e) => sum + e.available, 0),
    listedAt: nft.listedAt,
    version: nft.version,
  }
}
