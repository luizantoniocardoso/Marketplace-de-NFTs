import { http } from '@/shared/api'
import type { NftListParams, NftListResponse } from '@/shared/contracts'

export async function fetchNftList(params: NftListParams, signal?: AbortSignal) {
  const { data } = await http.get<NftListResponse>('/nfts', { params, signal })
  return data
}
