import { http } from '@/shared/api'
import type { NftDetailDto, NftListParams, NftListResponse } from '@/shared/contracts'

export async function fetchNftList(params: NftListParams, signal?: AbortSignal) {
  const { data } = await http.get<NftListResponse>('/nfts', { params, signal })
  return data
}

export async function fetchNftDetail(nftId: string, signal?: AbortSignal) {
  const { data } = await http.get<NftDetailDto>(`/nfts/${encodeURIComponent(nftId)}`, { signal })
  return data
}
