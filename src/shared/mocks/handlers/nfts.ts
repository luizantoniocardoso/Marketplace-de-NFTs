import { http, HttpResponse } from 'msw'
import { env } from '@/shared/config'
import {
  NFT_COLLECTION_LABELS,
  NFT_COLLECTIONS,
  NFT_NETWORK_LABELS,
  NFT_NETWORKS,
  NFT_SORTS,
  NFT_TABS,
  type NftCollection,
  type NftDetailDto,
  type NftListResponse,
  type NftNetwork,
  type NftSort,
  type NftTab,
} from '@/shared/contracts'
import { compareEth, isEthAmount } from '@/shared/lib'
import { db } from '../db'
import type { MockNft } from '../fixtures'
import { isScenario } from '../scenarios'
import { apiError, findNft, nftPrice, simulateNetwork, toNftDetail, toNftSummary } from '../services'

const DEFAULT_PAGE_SIZE = 9
const MAX_PAGE_SIZE = 48
const NEW_RELEASE_WINDOW_DAYS = 14
const TRENDING_SCORE = 70

const normalize = (value: string) => value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

interface Filters {
  q: string
  collections: NftCollection[]
  networks: NftNetwork[]
  minPrice?: string
  maxPrice?: string
  tab: NftTab
}

function matches(nft: MockNft, f: Filters, newestListing: number, skip?: 'collections' | 'networks') {
  if (f.q) {
    const haystack = normalize(`${nft.name} ${nft.creator.name} ${NFT_COLLECTION_LABELS[nft.collection]}`)
    if (!haystack.includes(normalize(f.q))) return false
  }
  if (skip !== 'collections' && f.collections.length && !f.collections.includes(nft.collection)) return false
  if (skip !== 'networks' && f.networks.length && !f.networks.includes(nft.network)) return false
  const price = nftPrice(nft)
  if (f.minPrice && compareEth(price, f.minPrice) < 0) return false
  if (f.maxPrice && compareEth(price, f.maxPrice) > 0) return false
  if (f.tab === 'new' && newestListing - Date.parse(nft.listedAt) > NEW_RELEASE_WINDOW_DAYS * 86_400_000) return false
  if (f.tab === 'trending' && nft.trendingScore < TRENDING_SCORE) return false
  return true
}

const sorters: Record<NftSort, (a: MockNft, b: MockNft) => number> = {
  recent: (a, b) => Date.parse(b.listedAt) - Date.parse(a.listedAt),
  'price-asc': (a, b) => compareEth(nftPrice(a), nftPrice(b)),
  'price-desc': (a, b) => compareEth(nftPrice(b), nftPrice(a)),
  'name-asc': (a, b) => a.name.localeCompare(b.name, 'pt-BR'),
}

export const nftHandlers = [
  http.get(`${env.API_URL}/nfts`, async ({ request }) => {
    const failure = await simulateNetwork()
    if (failure) return failure
    const url = new URL(request.url)
    const params = url.searchParams

    const sort = (params.get('sort') ?? 'recent') as NftSort
    const tab = (params.get('tab') ?? 'all') as NftTab
    const page = Number(params.get('page') ?? 1)
    const pageSize = Number(params.get('pageSize') ?? DEFAULT_PAGE_SIZE)
    const collections = params.getAll('collections') as NftCollection[]
    const networks = params.getAll('networks') as NftNetwork[]
    const minPrice = params.get('minPrice') ?? undefined
    const maxPrice = params.get('maxPrice') ?? undefined

    const fields: Record<string, string> = {}
    if (!NFT_SORTS.includes(sort)) fields.sort = 'Ordenação inválida'
    if (!NFT_TABS.includes(tab)) fields.tab = 'Aba inválida'
    if (!Number.isInteger(page) || page < 1) fields.page = 'Página inválida'
    if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > MAX_PAGE_SIZE)
      fields.pageSize = 'Tamanho de página inválido'
    if (collections.some((c) => !NFT_COLLECTIONS.includes(c))) fields.collections = 'Coleção inválida'
    if (networks.some((n) => !NFT_NETWORKS.includes(n))) fields.networks = 'Rede inválida'
    if (minPrice && !isEthAmount(minPrice)) fields.minPrice = 'Preço mínimo inválido'
    if (maxPrice && !isEthAmount(maxPrice)) fields.maxPrice = 'Preço máximo inválido'
    if (Object.keys(fields).length) return apiError('VALIDATION_ERROR', 'Parâmetros de busca inválidos', fields)

    const all = isScenario('empty-catalog') ? [] : db.data.nfts
    const newestListing = Math.max(0, ...all.map((n) => Date.parse(n.listedAt)))
    const filters: Filters = { q: params.get('q') ?? '', collections, networks, minPrice, maxPrice, tab }

    const results = all.filter((n) => matches(n, filters, newestListing)).sort(sorters[sort])
    const total = results.length
    const totalPages = Math.max(1, Math.ceil(total / pageSize))

    const countBy = <K extends 'collection' | 'network'>(key: K, skip: 'collections' | 'networks') => {
      const counts = new Map<MockNft[K], number>()
      for (const nft of all) {
        if (matches(nft, filters, newestListing, skip)) counts.set(nft[key], (counts.get(nft[key]) ?? 0) + 1)
      }
      return counts
    }
    const collectionCounts = countBy('collection', 'collections')
    const networkCounts = countBy('network', 'networks')
    const prices = db.data.nfts.map(nftPrice).sort(compareEth)

    return HttpResponse.json<NftListResponse>({
      items: results.slice((page - 1) * pageSize, page * pageSize).map(toNftSummary),
      page,
      pageSize,
      total,
      totalPages,
      facets: {
        collections: NFT_COLLECTIONS.map((value) => ({
          value,
          label: NFT_COLLECTION_LABELS[value],
          count: collectionCounts.get(value) ?? 0,
        })),
        networks: NFT_NETWORKS.map((value) => ({
          value,
          label: NFT_NETWORK_LABELS[value],
          count: networkCounts.get(value) ?? 0,
        })),
        price: { min: prices[0], max: prices[prices.length - 1] },
      },
    })
  }),

  http.get(`${env.API_URL}/nfts/:nftId`, async ({ params }) => {
    const failure = await simulateNetwork()
    if (failure) return failure
    const nft = findNft(String(params.nftId))
    if (!nft) return apiError('NOT_FOUND', 'Este NFT não existe ou foi removido do mercado.')
    return HttpResponse.json<NftDetailDto>(toNftDetail(nft))
  }),
]
