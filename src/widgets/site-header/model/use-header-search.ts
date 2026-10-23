import { useNavigate, useRouterState } from '@tanstack/react-router'
import { patchCatalogSearch, type CatalogSearch } from '@/entities/nft'

export function useHeaderSearch() {
  const navigate = useNavigate()
  const query = useRouterState({
    select: (state) => (state.location.pathname === '/' ? ((state.location.search as CatalogSearch).q ?? '') : ''),
  })

  const search = (term: string) =>
    navigate({
      to: '/',
      search: (prev) => patchCatalogSearch(prev as CatalogSearch, { q: term || undefined }),
    })

  return { query, search }
}
