import type { NftCollection, NftNetwork, NftRarity } from '@/shared/contracts'
import { createRandom } from './random'

export interface MockEdition {
  id: string
  label: string
  priceEth: string
  supply: number | null
  available: number
  maxPerOrder: number
}

export interface MockReview {
  id: string
  author: string
  rating: number
  comment: string
  createdAt: string
}

export interface MockNft {
  id: string
  name: string
  tokenId: string
  description: string
  story: string[]
  creator: { name: string; handle: string }
  collection: NftCollection
  collectionName: string
  network: NftNetwork
  rarity: NftRarity
  artwork: ArtworkKey
  attributes: string[]
  contractAddress: string
  rating: { average: number; count: number }
  reviews: MockReview[]
  previousPriceEth: string | null
  listedAt: string
  trendingScore: number
  editions: MockEdition[]
  defaultEditionId: string
  version: number
}

export const ARTWORKS = {
  'emerald-ape': {
    alt: 'Macaco de pelo castanho com óculos redondos e jaqueta college verde',
    collectionName: 'Kurio Apes',
    attributes: ['Óculos', 'Esmeralda'],
  },
  'sage-nomad': {
    alt: 'Gorila grisalho com chapéu bucket verde e moletom lilás',
    collectionName: 'Nomad Society',
    attributes: ['Chapéu bucket', 'Moletom lilás'],
  },
  'ivory-baron': {
    alt: 'Macaco de pelo escuro com blazer bege e gola alta verde',
    collectionName: 'Baron Club',
    attributes: ['Blazer', 'Gola alta'],
  },
  'golden-beat': {
    alt: 'Orangotango dourado com fones de ouvido verdes e jaqueta clara',
    collectionName: 'Golden Frequencies',
    attributes: ['Fones', 'Pelagem dourada'],
  },
} as const
export type ArtworkKey = keyof typeof ARTWORKS

const RARITY_ATTRIBUTE: Record<NftRarity, string> = {
  common: 'Comum',
  rare: 'Raro',
  legendary: 'Lendário',
}

const CREATORS = [
  { name: 'Nova Sato', handle: 'novasato' },
  { name: 'Studio Ferrugem', handle: 'ferrugem' },
  { name: 'Caio Brandt', handle: 'caiobrandt' },
  { name: 'Nina Okafor', handle: 'ninaokafor' },
  { name: 'Coletivo Âmbar', handle: 'ambar' },
]

const REVIEWERS = ['Marina C.', 'Rafael L.', 'Bia T.', 'Diego M.', 'Lara P.', 'Otávio R.']
const REVIEW_COMMENTS = [
  'Arte impecável e procedência clara. Chegou na carteira em segundos.',
  'Os detalhes em alta resolução são ainda melhores do que na prévia.',
  'Ótima entrada na coleção, a comunidade de colecionadores é muito ativa.',
  'Gostei da transparência sobre royalties e do contrato verificado.',
  'Edição bem equilibrada entre raridade e preço.',
  'Comprei a edição aberta e pretendo subir para a 1/10.',
]

const EDITION_TEMPLATES = [
  { key: 'e1', label: '1/1', supply: 1, factor: 3, maxPerOrder: 1 },
  { key: 'e10', label: '1/10', supply: 10, factor: 1.6, maxPerOrder: 3 },
  { key: 'e50', label: '1/50', supply: 50, factor: 1, maxPerOrder: 10 },
  { key: 'open', label: 'Aberta', supply: null, factor: 0.6, maxPerOrder: 20 },
] as const

const FEATURED: Array<
  Pick<MockNft, 'name' | 'artwork' | 'collection' | 'network' | 'rarity'> & {
    price: string
    previous?: string
  }
> = [
  {
    name: 'Emerald Ape #042',
    artwork: 'emerald-ape',
    collection: 'arte-digital',
    network: 'ethereum',
    rarity: 'common',
    price: '1.19',
  },
  {
    name: 'Sage Nomad #009',
    artwork: 'sage-nomad',
    collection: 'arte-digital',
    network: 'ethereum',
    rarity: 'common',
    price: '1.69',
  },
  {
    name: 'Neon Vessel #552',
    artwork: 'ivory-baron',
    collection: 'colecionaveis',
    network: 'polygon',
    rarity: 'rare',
    price: '1.99',
    previous: '2.29',
  },
  {
    name: 'Cosmic Bloom #118',
    artwork: 'sage-nomad',
    collection: 'generativa',
    network: 'ethereum',
    rarity: 'common',
    price: '1.29',
  },
  {
    name: 'Violet Nomad #314',
    artwork: 'sage-nomad',
    collection: 'arte-3d',
    network: 'solana',
    rarity: 'common',
    price: '1.39',
  },
  {
    name: 'Ivory Baron #088',
    artwork: 'ivory-baron',
    collection: 'fotografia',
    network: 'ethereum',
    rarity: 'legendary',
    price: '1.79',
  },
  {
    name: 'Golden Beat #207',
    artwork: 'golden-beat',
    collection: 'musica',
    network: 'polygon',
    rarity: 'common',
    price: '0.99',
  },
  {
    name: 'Amber Pulse #071',
    artwork: 'golden-beat',
    collection: 'musica',
    network: 'solana',
    rarity: 'common',
    price: '0.79',
  },
  {
    name: 'Golden Signal #160',
    artwork: 'golden-beat',
    collection: 'musica',
    network: 'ethereum',
    rarity: 'rare',
    price: '0.39',
  },
]

const PREFIXES = [
  'Amber',
  'Copper',
  'Jade',
  'Lunar',
  'Rust',
  'Velvet',
  'Onyx',
  'Saffron',
  'Ochre',
  'Moss',
  'Cobalt',
  'Sable',
  'Crimson',
  'Ivory',
  'Golden',
  'Emerald',
]
const NOUNS = [
  'Ape',
  'Nomad',
  'Baron',
  'Beat',
  'Signal',
  'Vessel',
  'Bloom',
  'Drifter',
  'Monk',
  'Pilot',
  'Echo',
  'Warden',
]
const ARTWORK_KEYS = Object.keys(ARTWORKS) as ArtworkKey[]
const COLLECTIONS: NftCollection[] = [
  'arte-digital',
  'fotografia',
  'musica',
  'arte-3d',
  'colecionaveis',
  'generativa',
  'jogos',
  'assinaturas',
  'utilidade',
]
const NETWORKS: NftNetwork[] = ['ethereum', 'polygon', 'solana']
const NETWORK_NAMES: Record<NftNetwork, string> = { ethereum: 'Ethereum', polygon: 'Polygon', solana: 'Solana' }
const HEX = '0123456789ABCDEF'

const TOTAL = 36
const NEWEST_LISTING = Date.UTC(2026, 8, 15, 12)
const HOUR = 3_600_000
const DAY = 24 * HOUR

function cents(value: number) {
  return (Math.round(value * 100) / 100).toFixed(2)
}

function pick<T>(list: readonly T[], random: () => number) {
  return list[Math.floor(random() * list.length)]
}

function editionsFor(id: string, basePrice: string, random: () => number, soldOut: boolean, featured: boolean) {
  const base = Number(basePrice)
  const templates = EDITION_TEMPLATES.filter((t) => featured || t.key === 'e50' || random() > 0.4)
  return templates.map<MockEdition>((t) => {
    const stock =
      t.supply === null ? 999 : t.key === 'e50' ? 10 + Math.floor(random() * 41) : Math.floor(random() * (t.supply + 1))
    return {
      id: `${id}-${t.key}`,
      label: t.label,
      priceEth: t.key === 'e50' ? basePrice : cents(base * t.factor),
      supply: t.supply,
      available: soldOut ? 0 : stock,
      maxPerOrder: t.maxPerOrder,
    }
  })
}

function contractAddress(random: () => number) {
  const body = Array.from({ length: 32 }, () => pick(HEX.split(''), random)).join('')
  return `0x7A42${body}19E8`
}

function reviewsFor(id: string, count: number, random: () => number): MockReview[] {
  return Array.from({ length: Math.min(count, 5) }, (_, index) => ({
    id: `${id}-r${index + 1}`,
    author: pick(REVIEWERS, random),
    rating: random() > 0.25 ? 5 : 4,
    comment: pick(REVIEW_COMMENTS, random),
    createdAt: new Date(NEWEST_LISTING - (index + 1) * 3 * DAY).toISOString(),
  }))
}

function storyFor(name: string, edition: string, network: NftNetwork, creator: string, collectionName: string) {
  return [
    `${name} é uma obra digital ${edition} finalizada à mão da coleção ${collectionName}. Cada atributo fica armazenado nos metadados do token e verificado na ${NETWORK_NAMES[network]}. A obra explora identidade, movimento e luz em um mundo digital sem fronteiras.`,
    `A propriedade inclui a arte em alta resolução, lançamentos exclusivos para colecionadores e um registro permanente de procedência registrada na rede. ${creator} recebe 5% de direitos autorais nas vendas secundárias, apoiando novos trabalhos e lançamentos da comunidade.`,
  ]
}

export function createNftFixtures(): MockNft[] {
  const random = createRandom(42)
  const usedNames = new Set(FEATURED.map((f) => f.name))
  const nfts: MockNft[] = []

  for (let i = 0; i < TOTAL; i++) {
    const id = `nft-${String(i + 1).padStart(3, '0')}`
    const featured = FEATURED[i]
    let name = featured?.name
    while (!name || (!featured && usedNames.has(name))) {
      name = `${pick(PREFIXES, random)} ${pick(NOUNS, random)} #${String(Math.floor(random() * 900) + 100)}`
    }
    usedNames.add(name)

    const price =
      featured?.price ?? (i === TOTAL - 1 ? '12.30' : i === TOTAL - 2 ? '0.02' : cents(0.05 + random() * 9.5))
    const soldOut = !featured && i % 13 === 0
    const creator = CREATORS[i % CREATORS.length]
    const artwork = featured?.artwork ?? pick(ARTWORK_KEYS, random)
    const network = featured?.network ?? pick(NETWORKS, random)
    const rarity = featured?.rarity ?? (random() > 0.85 ? 'legendary' : random() > 0.7 ? 'rare' : 'common')
    const { collectionName, attributes } = ARTWORKS[artwork]
    const ratingCount = i === 0 ? 19 : 3 + Math.floor(random() * 38)
    const editions = editionsFor(id, price, random, soldOut, Boolean(featured))
    const tokenNumber = name.match(/#(\d+)/)?.[1] ?? String(i + 1)

    nfts.push({
      id,
      name,
      tokenId: `#${tokenNumber.padStart(4, '0')}`,
      description: `Um colecionável digital finalizado à mão da coleção Kurio Editions, verificado na ${NETWORK_NAMES[network]}, com arte desbloqueável e acesso para colecionadores.`,
      story: storyFor(name, '1/50', network, creator.name, 'Kurio Editions'),
      creator,
      collection: featured?.collection ?? pick(COLLECTIONS, random),
      collectionName,
      network,
      rarity,
      artwork,
      attributes: [...attributes, RARITY_ATTRIBUTE[rarity]],
      contractAddress: contractAddress(random),
      rating: { average: i === 0 ? 4.8 : Math.round((3.8 + random() * 1.2) * 10) / 10, count: ratingCount },
      reviews: reviewsFor(id, ratingCount, random),
      previousPriceEth: featured ? (featured.previous ?? null) : random() > 0.85 ? cents(Number(price) * 1.15) : null,
      listedAt: new Date(NEWEST_LISTING - i * 26 * HOUR).toISOString(),
      trendingScore: Math.floor(random() * 100),
      editions,
      defaultEditionId: `${id}-e50`,
      version: 1,
    })
  }

  return nfts
}
