import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import type { NftListParams } from '@/shared/contracts'
import { fetchNftDetail, fetchNftList } from './nft-api'

export const nftKeys = {
  all: ['nfts'] as const,
  lists: () => [...nftKeys.all, 'list'] as const,
  list: (params: NftListParams) => [...nftKeys.lists(), params] as const,
  details: () => [...nftKeys.all, 'detail'] as const,
  detail: (nftId: string) => [...nftKeys.details(), nftId] as const,
}

export const nftQueries = {
  list: (params: NftListParams) =>
    queryOptions({
      queryKey: nftKeys.list(params),
      queryFn: ({ signal }) => fetchNftList(params, signal),
      placeholderData: keepPreviousData,
    }),
  detail: (nftId: string) =>
    queryOptions({
      queryKey: nftKeys.detail(nftId),
      queryFn: ({ signal }) => fetchNftDetail(nftId, signal),
    }),
}
