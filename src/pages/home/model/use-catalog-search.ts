import { getRouteApi } from '@tanstack/react-router'
import { useCallback } from 'react'
import { patchCatalogSearch, type CatalogSearch } from '@/entities/nft'

const route = getRouteApi('/')

export function useCatalogSearch() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const onSearchChange = useCallback(
    (patch: Partial<CatalogSearch>) =>
      navigate({
        search: (prev) => patchCatalogSearch(prev, patch),
        replace: 'q' in patch,
        resetScroll: false,
      }),
    [navigate],
  )

  return { search, onSearchChange }
}
