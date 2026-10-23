import { Facebook, Instagram, Linkedin, Twitter, Youtube, type LucideIcon } from 'lucide-react'
import type { NftCollection } from '@/shared/contracts'

export interface FooterFeature {
  letter: string
  title: string
  text: string
}

export interface FooterSocial {
  label: string
  Icon: LucideIcon
}

export const FOOTER_FEATURES: FooterFeature[] = [
  {
    letter: 'W',
    title: 'Segurança da carteira',
    text: 'Proteja sua carteira e colecione arte digital verificada com confiança.',
  },
  {
    letter: 'C',
    title: 'Criadores em destaque',
    text: 'Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.',
  },
  {
    letter: 'D',
    title: 'Alertas de lançamentos',
    text: 'Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado.',
  },
]

export const FOOTER_CONTACT = {
  tagline: 'Feito para colecionadores, criadores e cultura',
  email: 'contato@email.com',
  phone: { label: '+55 11 4002 8922', href: 'tel:+551140028922' },
}

export const FOOTER_PROFILE_LINKS = ['Minha coleção', 'Atividade', 'Estúdio do criador', 'Lista de interesse']

export const FOOTER_HELP_LINKS = [
  'Central de ajuda',
  'Como comprar NFTs',
  'Carteira e segurança',
  'Política do mercado',
  'Denunciar item',
]

export const FOOTER_COLLECTIONS: NftCollection[] = ['arte-digital', 'fotografia', 'musica', 'arte-3d', 'utilidade']

export const FOOTER_SOCIALS: FooterSocial[] = [
  { label: 'Facebook', Icon: Facebook },
  { label: 'Instagram', Icon: Instagram },
  { label: 'Twitter', Icon: Twitter },
  { label: 'LinkedIn', Icon: Linkedin },
  { label: 'YouTube', Icon: Youtube },
]

export const FOOTER_WALLETS = ['METAMASK', 'WALLETCONNECT', 'COINBASE']
