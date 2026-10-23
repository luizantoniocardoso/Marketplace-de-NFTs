import type { CatalogSearch } from './catalog-search'

export type CatalogFilterValue = Pick<CatalogSearch, 'collections' | 'networks' | 'minPrice' | 'maxPrice'>

export const CLEARED_CATALOG_FILTERS: Partial<CatalogSearch> = {
  q: undefined,
  collections: undefined,
  networks: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  tab: undefined,
}

export function patchCatalogSearch(current: CatalogSearch, patch: Partial<CatalogSearch>): CatalogSearch {
  const next = { ...current, ...patch }
  if (!('page' in patch)) delete next.page
  return Object.fromEntries(
    Object.entries(next).filter(([, value]) => value !== undefined && !(Array.isArray(value) && !value.length)),
  ) as CatalogSearch
}

export function hasActiveFilters(search: CatalogSearch) {
  return Boolean(search.q || search.collections || search.networks || search.minPrice || search.maxPrice)
}

export function countActiveFilters(search: CatalogSearch) {
  return (
    (search.collections?.length ?? 0) + (search.networks?.length ?? 0) + (search.minPrice || search.maxPrice ? 1 : 0)
  )
}
