import type { CatalogFilterValue } from '@/entities/nft'
import type { NftListResponse } from '@/shared/contracts'
import { cn, toggleItem } from '@/shared/lib'
import { FacetList } from './FacetList'
import { PriceRange } from './PriceRange'

interface CatalogFiltersProps {
  facets?: NftListResponse['facets']
  value: CatalogFilterValue
  onChange: (patch: Partial<CatalogFilterValue>) => void
  className?: string
}

export function CatalogFilters({ facets, value, onChange, className }: CatalogFiltersProps) {
  return (
    <div className={cn('flex flex-col gap-8', className)}>
      <FacetList
        title="Coleções"
        options={facets?.collections}
        selected={value.collections}
        skeletonRows={9}
        emphasizeCount
        onToggle={(collection) => onChange({ collections: toggleItem(value.collections, collection) })}
      />
      <PriceRange bounds={facets?.price} minPrice={value.minPrice} maxPrice={value.maxPrice} onApply={onChange} />
      <FacetList
        title="Rede"
        options={facets?.networks}
        selected={value.networks}
        skeletonRows={3}
        onToggle={(network) => onChange({ networks: toggleItem(value.networks, network) })}
      />
    </div>
  )
}
