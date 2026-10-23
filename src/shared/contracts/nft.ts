import type { Paginated } from './common'

export const NFT_COLLECTIONS = [
  'arte-digital',
  'fotografia',
  'musica',
  'arte-3d',
  'colecionaveis',
  'generativa',
  'jogos',
  'assinaturas',
  'utilidade',
] as const
export type NftCollection = (typeof NFT_COLLECTIONS)[number]

export const NFT_NETWORKS = ['ethereum', 'polygon', 'solana'] as const
export type NftNetwork = (typeof NFT_NETWORKS)[number]

export const NFT_SORTS = ['recent', 'price-asc', 'price-desc', 'name-asc'] as const
export type NftSort = (typeof NFT_SORTS)[number]

export const NFT_TABS = ['all', 'new', 'trending'] as const
export type NftTab = (typeof NFT_TABS)[number]

export type NftRarity = 'common' | 'rare' | 'legendary'

export interface NftImageDto {
  small: string
  large: string
  alt: string
}

export interface NftSummaryDto {
  id: string
  name: string
  collection: NftCollection
  network: NftNetwork
  priceEth: string
  previousPriceEth: string | null
  rarity: NftRarity
  image: NftImageDto
  available: number
  listedAt: string
  version: number
}

export interface NftListParams {
  q?: string
  collections?: NftCollection[]
  networks?: NftNetwork[]
  minPrice?: string
  maxPrice?: string
  sort?: NftSort
  tab?: NftTab
  page?: number
  pageSize?: number
}

export interface FacetOption<T extends string> {
  value: T
  label: string
  count: number
}

export interface NftListResponse extends Paginated<NftSummaryDto> {
  facets: {
    collections: FacetOption<NftCollection>[]
    networks: FacetOption<NftNetwork>[]
    price: { min: string; max: string }
  }
}

export const NFT_COLLECTION_LABELS: Record<NftCollection, string> = {
  'arte-digital': 'Arte digital',
  fotografia: 'Fotografia',
  musica: 'Música',
  'arte-3d': 'Arte 3D',
  colecionaveis: 'Colecionáveis',
  generativa: 'Generativa',
  jogos: 'Jogos',
  assinaturas: 'Assinaturas',
  utilidade: 'Utilidade',
}

export const NFT_NETWORK_LABELS: Record<NftNetwork, string> = {
  ethereum: 'Ethereum',
  polygon: 'Polygon',
  solana: 'Solana',
}

export const NFT_SORT_LABELS: Record<NftSort, string> = {
  recent: 'Listados recentemente',
  'price-asc': 'Menor preço',
  'price-desc': 'Maior preço',
  'name-asc': 'Nome (A–Z)',
}

export const NFT_TAB_LABELS: Record<NftTab, string> = {
  all: 'Todos os NFTs',
  new: 'Novos lançamentos',
  trending: 'Em alta',
}
