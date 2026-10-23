import type { NftRarity } from '@/shared/contracts'
import { cn } from '@/shared/lib'
import { NFT_RARITY_BADGES } from '../model'

interface NftRarityBadgeProps {
  rarity: NftRarity
  className?: string
}

export function NftRarityBadge({ rarity, className }: NftRarityBadgeProps) {
  const label = NFT_RARITY_BADGES[rarity]
  if (!label) return null

  return <span className={cn('bg-brand px-2 py-1 text-caption font-bold text-ink uppercase', className)}>{label}</span>
}
