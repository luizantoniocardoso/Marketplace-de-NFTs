import { CATALOG_SECTION_ID } from '@/shared/config'

export interface NavItem {
  label: string
  to?: '/'
  hash?: string
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Início', to: '/' },
  { label: 'Mercado', to: '/', hash: CATALOG_SECTION_ID },
  { label: 'Criadores' },
  { label: 'Aprenda' },
]
