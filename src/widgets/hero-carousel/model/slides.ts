export interface HeroSlide {
  artwork: string
  secondaryArtwork: string
  alt: string
  title: [string, string]
  mobileTitle: [string, string]
  description: string
  mobileDescription: string
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    artwork: 'emerald-ape',
    secondaryArtwork: 'sage-nomad',
    alt: 'Emerald Ape #042: macaco de pelo castanho com óculos redondos e jaqueta college verde',
    title: ['SEJA DONO DO FUTURO', 'DA ARTE DIGITAL'],
    mobileTitle: ['SEJA DONO DA', 'CULTURA DIGITAL'],
    description:
      'Descubra NFTs selecionados de criadores emergentes e consagrados. Colecione arte digital rara, apoie artistas e tenha uma parte da cultura da internet.',
    mobileDescription: 'Descubra NFTs selecionados de criadores do mundo todo.',
  },
  {
    artwork: 'sage-nomad',
    secondaryArtwork: 'ivory-baron',
    alt: 'Sage Nomad #009: gorila grisalho com chapéu bucket verde e moletom lilás',
    title: ['EDIÇÕES LIMITADAS', 'DIRETO DO CRIADOR'],
    mobileTitle: ['EDIÇÕES', 'LIMITADAS'],
    description:
      'Lançamentos gênesis com procedência verificada. Garanta sua edição antes da revelação pública e acompanhe cada cunhagem em tempo real.',
    mobileDescription: 'Lançamentos gênesis com procedência verificada.',
  },
  {
    artwork: 'golden-beat',
    secondaryArtwork: 'emerald-ape',
    alt: 'Golden Beat #207: orangotango dourado com fones de ouvido verdes',
    title: ['A TRILHA SONORA', 'DA NOVA INTERNET'],
    mobileTitle: ['MÚSICA E', 'ARTE GENERATIVA'],
    description:
      'Coleções de música, arte generativa e colecionáveis de estúdios independentes. Explore novos artistas e apoie quem constrói a cultura digital.',
    mobileDescription: 'Coleções de música e arte de estúdios independentes.',
  },
]
