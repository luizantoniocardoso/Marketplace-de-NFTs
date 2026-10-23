import type { NftCollection, NftNetwork, NftRarity } from '@/shared/contracts'
import { createRandom } from './random'

export interface MockEdition {
  id: string
  label: string
  priceEth: string
  supply: number
  available: number
  maxPerOrder: number
}

export interface MockNft {
  id: string
  name: string
  description: string
  creator: { name: string; handle: string }
  collection: NftCollection
  network: NftNetwork
  rarity: NftRarity
  artwork: ArtworkKey
  previousPriceEth: string | null
  listedAt: string
  trendingScore: number
  editions: MockEdition[]
  version: number
}

export const ARTWORKS = {
  'emerald-ape': 'Macaco de pelo castanho com óculos redondos e jaqueta college verde',
  'sage-nomad': 'Gorila grisalho com chapéu bucket verde e moletom lilás',
  'ivory-baron': 'Macaco de pelo escuro com blazer bege e gola alta verde',
  'golden-beat': 'Orangotango dourado com fones de ouvido verdes e jaqueta clara',
} as const
export type ArtworkKey = keyof typeof ARTWORKS

const CREATORS = [
  { name: 'Lia Moreau', handle: 'liamoreau' },
  { name: 'Studio Ferrugem', handle: 'ferrugem' },
  { name: 'Caio Brandt', handle: 'caiobrandt' },
  { name: 'Nina Okafor', handle: 'ninaokafor' },
  { name: 'Coletivo Âmbar', handle: 'ambar' },
]

const FEATURED: Array<Pick<MockNft, 'name' | 'artwork' | 'collection' | 'network' | 'rarity'> & {
  price: string
  previous?: string
}> = [
  { name: 'Emerald Ape #042', artwork: 'emerald-ape', collection: 'arte-digital', network: 'ethereum', rarity: 'common', price: '1.19' },
  { name: 'Sage Nomad #009', artwork: 'sage-nomad', collection: 'arte-digital', network: 'ethereum', rarity: 'common', price: '1.69' },
  { name: 'Neon Vessel #552', artwork: 'ivory-baron', collection: 'colecionaveis', network: 'polygon', rarity: 'rare', price: '1.99', previous: '2.29' },
  { name: 'Cosmic Bloom #118', artwork: 'sage-nomad', collection: 'generativa', network: 'ethereum', rarity: 'common', price: '1.29' },
  { name: 'Violet Nomad #314', artwork: 'sage-nomad', collection: 'arte-3d', network: 'solana', rarity: 'common', price: '1.39' },
  { name: 'Ivory Baron #088', artwork: 'ivory-baron', collection: 'fotografia', network: 'ethereum', rarity: 'legendary', price: '1.79' },
  { name: 'Golden Beat #207', artwork: 'golden-beat', collection: 'musica', network: 'polygon', rarity: 'common', price: '0.99' },
  { name: 'Amber Pulse #071', artwork: 'golden-beat', collection: 'musica', network: 'solana', rarity: 'common', price: '0.79' },
  { name: 'Golden Signal #160', artwork: 'golden-beat', collection: 'musica', network: 'ethereum', rarity: 'rare', price: '0.39' },
]

const PREFIXES = ['Amber', 'Copper', 'Jade', 'Lunar', 'Rust', 'Velvet', 'Onyx', 'Saffron', 'Ochre', 'Moss', 'Cobalt', 'Sable', 'Crimson', 'Ivory', 'Golden', 'Emerald']
const NOUNS = ['Ape', 'Nomad', 'Baron', 'Beat', 'Signal', 'Vessel', 'Bloom', 'Drifter', 'Monk', 'Pilot', 'Echo', 'Warden']
const ARTWORK_KEYS = Object.keys(ARTWORKS) as ArtworkKey[]
const COLLECTIONS: NftCollection[] = ['arte-digital', 'fotografia', 'musica', 'arte-3d', 'colecionaveis', 'generativa', 'jogos', 'assinaturas', 'utilidade']
const NETWORKS: NftNetwork[] = ['ethereum', 'polygon', 'solana']

const TOTAL = 36
const NEWEST_LISTING = Date.UTC(2026, 8, 15, 12)
const HOUR = 3_600_000

function cents(value: number) {
  return (Math.round(value * 100) / 100).toFixed(2)
}

function editionsFor(id: string, basePrice: string, random: () => number, soldOut: boolean): MockEdition[] {
  const base = Number(basePrice)
  const count = 1 + Math.floor(random() * 3)
  const templates = [
    { label: 'Edição padrão', factor: 1, supply: 50 },
    { label: 'Edição de colecionador', factor: 1.6, supply: 10 },
    { label: 'Edição gênesis', factor: 2.4, supply: 3 },
  ]
  return templates.slice(0, count).map((t, index) => {
    const available = soldOut ? 0 : Math.floor(random() * (t.supply + 1))
    return {
      id: `${id}-ed${index + 1}`,
      label: t.label,
      priceEth: cents(base * t.factor),
      supply: t.supply,
      available: index === 0 && !soldOut ? Math.max(available, 5) : available,
      maxPerOrder: Math.min(5, t.supply),
    }
  })
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
      const prefix = PREFIXES[Math.floor(random() * PREFIXES.length)]
      const noun = NOUNS[Math.floor(random() * NOUNS.length)]
      name = `${prefix} ${noun} #${String(Math.floor(random() * 900) + 100)}`
    }
    usedNames.add(name)

    const price = featured?.price ?? (i === TOTAL - 1 ? '12.30' : i === TOTAL - 2 ? '0.02' : cents(0.05 + random() * 9.5))
    const soldOut = !featured && i % 13 === 0
    const creator = CREATORS[i % CREATORS.length]

    nfts.push({
      id,
      name,
      description: `${name} faz parte de uma série de retratos digitais de ${creator.name}, cunhada com metadados verificados e royalties para o criador em cada revenda.`,
      creator,
      collection: featured?.collection ?? COLLECTIONS[Math.floor(random() * COLLECTIONS.length)],
      network: featured?.network ?? NETWORKS[Math.floor(random() * NETWORKS.length)],
      rarity: featured?.rarity ?? (random() > 0.85 ? 'legendary' : random() > 0.7 ? 'rare' : 'common'),
      artwork: featured?.artwork ?? ARTWORK_KEYS[Math.floor(random() * ARTWORK_KEYS.length)],
      previousPriceEth: featured ? (featured.previous ?? null) : random() > 0.85 ? cents(Number(price) * 1.15) : null,
      listedAt: new Date(NEWEST_LISTING - i * 26 * HOUR).toISOString(),
      trendingScore: Math.floor(random() * 100),
      editions: editionsFor(id, price, random, soldOut),
      version: 1,
    })
  }

  return nfts
}
