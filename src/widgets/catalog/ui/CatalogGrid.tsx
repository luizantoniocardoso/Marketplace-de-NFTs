import { CATALOG_PAGE_SIZE, NftCard, NftCardSkeleton } from '@/entities/nft'
import type { NftSummaryDto } from '@/shared/contracts'
import { cn } from '@/shared/lib'

const PRIORITY_ITEMS = 3

interface CatalogGridProps {
  items?: NftSummaryDto[]
  isBusy: boolean
  isUpdating: boolean
}

const staggered = (index: number) => cn(index % 2 === 1 && 'max-md:translate-y-8')

export function CatalogGrid({ items, isBusy, isUpdating }: CatalogGridProps) {
  return (
    <ul
      aria-busy={isBusy}
      className={cn(
        'mt-6 grid grid-cols-2 gap-x-4 gap-y-6 transition-opacity md:mt-7 md:gap-y-[58px] lg:grid-cols-3 lg:gap-x-[34px]',
        isUpdating && 'opacity-60',
      )}
    >
      {items
        ? items.map((nft, index) => (
            <li key={nft.id} className={staggered(index)}>
              <NftCard nft={nft} priority={index < PRIORITY_ITEMS} />
            </li>
          ))
        : Array.from({ length: CATALOG_PAGE_SIZE }, (_, index) => (
            <li key={index} className={staggered(index)}>
              <NftCardSkeleton />
            </li>
          ))}
    </ul>
  )
}
