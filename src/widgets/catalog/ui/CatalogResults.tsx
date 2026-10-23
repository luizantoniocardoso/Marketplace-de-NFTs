import { CLEARED_CATALOG_FILTERS, hasActiveFilters } from '@/entities/nft'
import { getApiError } from '@/shared/api'
import { useCatalog, type CatalogControls } from '../model'
import { CatalogEmpty } from './CatalogEmpty'
import { CatalogError } from './CatalogError'
import { CatalogGrid } from './CatalogGrid'

interface CatalogResultsProps extends CatalogControls {
  isUpdating: boolean
}

export function CatalogResults({ search, onSearchChange, isUpdating }: CatalogResultsProps) {
  const { data, error, isPending, isError, refetch } = useCatalog(search)

  if (isError && !data) {
    return <CatalogError message={getApiError(error).message} onRetry={() => refetch()} />
  }

  if (data?.items.length === 0) {
    return (
      <CatalogEmpty
        filtered={hasActiveFilters(search) || Boolean(search.tab)}
        onClearFilters={() => onSearchChange(CLEARED_CATALOG_FILTERS)}
      />
    )
  }

  return <CatalogGrid items={data?.items} isBusy={isPending || isUpdating} isUpdating={isUpdating} />
}
