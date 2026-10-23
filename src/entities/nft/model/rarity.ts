import type { NftRarity } from '@/shared/contracts'

export const NFT_RARITY_BADGES: Partial<Record<NftRarity, string>> = {
  rare: 'Raro',
  legendary: 'Lendário',
}
