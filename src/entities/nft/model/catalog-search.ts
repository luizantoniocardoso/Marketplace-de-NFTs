import { z } from 'zod/mini'
import {
  NFT_COLLECTIONS,
  NFT_NETWORKS,
  NFT_SORTS,
  NFT_TABS,
  type NftListParams,
} from '@/shared/contracts'
import { isEthAmount } from '@/shared/lib'

export const CATALOG_PAGE_SIZE = 9

const optional = <T extends z.ZodMiniType>(schema: T) => z.catch(z.optional(schema), undefined)
const ethAmount = z.string().check(z.refine(isEthAmount))

export const catalogSearchSchema = z.object({
  q: optional(z.string().check(z.trim(), z.minLength(1), z.maxLength(80))),
  collections: optional(z.array(z.enum(NFT_COLLECTIONS)).check(z.minLength(1))),
  networks: optional(z.array(z.enum(NFT_NETWORKS)).check(z.minLength(1))),
  minPrice: optional(ethAmount),
  maxPrice: optional(ethAmount),
  sort: optional(z.enum(NFT_SORTS)),
  tab: optional(z.enum(NFT_TABS)),
  page: optional(z.int().check(z.minimum(1))),
})

export type CatalogSearch = z.infer<typeof catalogSearchSchema>

export function toNftListParams(search: CatalogSearch): NftListParams {
  return {
    ...search,
    sort: search.sort ?? 'recent',
    tab: search.tab ?? 'all',
    page: search.page ?? 1,
    pageSize: CATALOG_PAGE_SIZE,
  }
}
