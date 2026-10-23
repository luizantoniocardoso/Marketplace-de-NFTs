import { CatalogFilters } from '@/features/catalog-filters'
import type { NftListResponse } from '@/shared/contracts'
import type { CatalogControls } from '../model'
import { FeaturedNftBanner } from './FeaturedNftBanner'

interface CatalogSidebarProps extends CatalogControls {
  facets?: NftListResponse['facets']
}

export function CatalogSidebar({ search, onSearchChange, facets }: CatalogSidebarProps) {
  return (
    <aside aria-label="Filtros do catálogo" className="hidden md:flex md:flex-col md:gap-6">
      <div className="bg-surface-card p-5">
        <CatalogFilters facets={facets} value={search} onChange={onSearchChange} />
      </div>
      <div className="hidden lg:block">
        <FeaturedNftBanner />
      </div>
    </aside>
  )
}
