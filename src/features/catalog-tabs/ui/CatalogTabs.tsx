import { NFT_TAB_LABELS, NFT_TABS, type NftTab } from '@/shared/contracts'
import { cn } from '@/shared/lib'
import { CatalogTabButton } from './CatalogTabButton'

const DEFAULT_TAB: NftTab = 'all'

interface CatalogTabsProps {
  value?: NftTab
  onChange: (tab: NftTab | undefined) => void
  className?: string
}

export function CatalogTabs({ value = DEFAULT_TAB, onChange, className }: CatalogTabsProps) {
  return (
    <div role="group" aria-label="Listas de NFTs" className={cn('flex items-center gap-1.5 md:gap-[18px]', className)}>
      {NFT_TABS.map((tab) => (
        <CatalogTabButton
          key={tab}
          active={tab === value}
          onClick={() => onChange(tab === DEFAULT_TAB ? undefined : tab)}
        >
          {NFT_TAB_LABELS[tab]}
        </CatalogTabButton>
      ))}
    </div>
  )
}
