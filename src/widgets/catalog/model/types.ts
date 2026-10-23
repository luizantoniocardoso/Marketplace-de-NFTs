import type { CatalogSearch } from '@/entities/nft'

export interface CatalogControls {
  search: CatalogSearch
  onSearchChange: (patch: Partial<CatalogSearch>) => void
}
