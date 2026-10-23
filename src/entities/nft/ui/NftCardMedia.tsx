import type { ReactNode } from 'react'
import type { NftSummaryDto } from '@/shared/contracts'
import { cn } from '@/shared/lib'
import { NftRarityBadge } from './NftRarityBadge'

interface NftCardMediaProps {
  nft: NftSummaryDto
  action?: ReactNode
  priority: boolean
}

export function NftCardMedia({ nft, action, priority }: NftCardMediaProps) {
  const soldOut = nft.available === 0

  return (
    <div className="relative flex items-center bg-surface-card p-1.5 max-md:rounded-2xl md:aspect-[259/299] md:px-[5px] md:py-0">
      <img
        src={nft.image.small}
        srcSet={`${nft.image.small} 480w, ${nft.image.large} 960w`}
        sizes="(min-width: 1024px) 250px, (min-width: 768px) 30vw, 45vw"
        width={480}
        height={480}
        alt={nft.image.alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={cn(
          'aspect-square w-full rounded-xl object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.02]',
          soldOut && 'opacity-60 grayscale',
        )}
      />
      <NftRarityBadge rarity={nft.rarity} className="absolute top-4 left-0 md:hidden" />
      {action && <div className="absolute top-4 right-4 z-10">{action}</div>}
    </div>
  )
}
