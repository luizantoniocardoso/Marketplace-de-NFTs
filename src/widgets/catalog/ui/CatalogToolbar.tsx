import { CatalogSort } from '@/features/catalog-sort'
import { CatalogTabs } from '@/features/catalog-tabs'
import type { CatalogControls } from '../model'

export function CatalogToolbar({ search, onSearchChange }: CatalogControls) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 md:-mt-[9px]">
      <CatalogTabs
        value={search.tab}
        onChange={(tab) => onSearchChange({ tab })}
        className="-mx-1 [scrollbar-width:none] overflow-x-auto px-1"
      />
      <div className="hidden md:block">
        <CatalogSort value={search.sort} onChange={(sort) => onSearchChange({ sort })} />
      </div>
    </div>
  )
}
