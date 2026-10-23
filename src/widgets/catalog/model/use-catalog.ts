import { useQuery } from '@tanstack/react-query'
import { nftQueries, toNftListParams, type CatalogSearch } from '@/entities/nft'

export function useCatalog(search: CatalogSearch) {
  return useQuery(nftQueries.list(toNftListParams(search)))
}
