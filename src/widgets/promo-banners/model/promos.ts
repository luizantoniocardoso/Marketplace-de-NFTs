import type { CatalogSearch } from '@/entities/nft'

export interface Promo {
  artwork: string
  alt: string
  title: string
  text: string
  search: CatalogSearch
}

export const PROMOS: Promo[] = [
  {
    artwork: 'emerald-ape',
    alt: 'Emerald Ape #042',
    title: 'Lançamentos gênesis de edição limitada',
    text: 'Colecione edições escassas diretamente dos criadores antes da revelação pública.',
    search: { tab: 'new' },
  },
  {
    artwork: 'ivory-baron',
    alt: 'Ivory Baron #088',
    title: 'Arte digital selecionada e muito mais',
    text: 'Explore novos artistas, coleções verificadas e obras digitais que definem a cultura.',
    search: { collections: ['arte-digital'] },
  },
]
