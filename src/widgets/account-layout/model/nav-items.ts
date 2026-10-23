import {
  ChartSpline,
  Heart,
  HardDriveDownload,
  MapPin,
  ShoppingCart,
  TriangleAlert,
  User,
  type LucideIcon,
} from 'lucide-react'

export interface AccountNavItem {
  label: string
  icon: LucideIcon
  to?: '/profile' | '/wallets' | '/favorites'
}

export const ACCOUNT_NAV_ITEMS: AccountNavItem[] = [
  { label: 'Dados do perfil', icon: User, to: '/profile' },
  { label: 'Carteiras', icon: MapPin, to: '/wallets' },
  { label: 'Atividade', icon: ShoppingCart },
  { label: 'Lista de interesse', icon: Heart, to: '/favorites' },
  { label: 'Ofertas', icon: ChartSpline },
  { label: 'Arquivos baixados', icon: HardDriveDownload },
  { label: 'Suporte', icon: TriangleAlert },
]
