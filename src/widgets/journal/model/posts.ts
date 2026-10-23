export interface JournalPost {
  artwork: string
  date: string
  reading: number
  title: string
  text: string
}

export const JOURNAL_POSTS: JournalPost[] = [
  {
    artwork: 'ivory-baron',
    date: '12 de setembro',
    reading: 6,
    title: 'Como funciona a propriedade de NFTs',
    text: 'Aprenda a colecionar, negociar e verificar ativos digitais.',
  },
  {
    artwork: 'emerald-ape',
    date: '13 de setembro',
    reading: 2,
    title: '10 artistas digitais para acompanhar',
    text: 'Conheça criadores que moldam a cultura digital.',
  },
  {
    artwork: 'sage-nomad',
    date: '15 de setembro',
    reading: 3,
    title: 'Raridade, atributos e procedência',
    text: 'Entenda raridade, procedência, direitos autorais e utilidade.',
  },
  {
    artwork: 'golden-beat',
    date: '15 de setembro',
    reading: 2,
    title: 'Como proteger sua carteira',
    text: 'Proteja sua carteira, seus ativos e sua identidade.',
  },
]
