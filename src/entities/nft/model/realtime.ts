import type { QueryClient } from '@tanstack/react-query'
import type { NftDetailDto, NftListResponse, NftUpdatedData } from '@/shared/contracts'
import { nftKeys } from '../api'

export function applyNftUpdate(queryClient: QueryClient, data: NftUpdatedData, version: number) {
  let applied = false

  queryClient.setQueryData<NftDetailDto>(nftKeys.detail(data.nftId), (current) => {
    if (!current || current.version >= version) return current
    applied = true
    return {
      ...current,
      version,
      priceEth: data.priceEth,
      available: data.available,
      editions: current.editions.map((edition) => {
        const patch = data.editions.find((item) => item.id === edition.id)
        return patch ? { ...edition, priceEth: patch.priceEth, available: patch.available } : edition
      }),
    }
  })

  queryClient.setQueriesData<NftListResponse>({ queryKey: nftKeys.lists() }, (current) => {
    if (!current?.items.some((item) => item.id === data.nftId && item.version < version)) return current
    applied = true
    return {
      ...current,
      items: current.items.map((item) =>
        item.id === data.nftId && item.version < version
          ? { ...item, version, priceEth: data.priceEth, available: data.available }
          : item,
      ),
    }
  })

  return applied
}
