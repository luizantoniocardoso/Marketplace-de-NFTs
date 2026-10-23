import { CATALOG_SECTION_ID } from '@/shared/config'
import { useCatalog, type CatalogControls } from '../model'
import { CatalogPager } from './CatalogPager'
import { CatalogResults } from './CatalogResults'
import { CatalogSidebar } from './CatalogSidebar'
import { CatalogStatus } from './CatalogStatus'
import { CatalogToolbar } from './CatalogToolbar'

export function CatalogSection({ search, onSearchChange }: CatalogControls) {
  const { data, isPending, isPlaceholderData, isFetching } = useCatalog(search)
  const isUpdating = isFetching && isPlaceholderData

  return (
    <section
      id={CATALOG_SECTION_ID}
      aria-labelledby="catalog-title"
      className="page-container scroll-mt-4 md:grid md:grid-cols-[minmax(0,240px)_1fr] md:gap-8 lg:grid-cols-[310px_1fr] lg:gap-12"
    >
      <h2 id="catalog-title" className="sr-only">
        Catálogo de NFTs
      </h2>
      <CatalogSidebar search={search} onSearchChange={onSearchChange} facets={data?.facets} />
      <div className="min-w-0">
        <CatalogToolbar search={search} onSearchChange={onSearchChange} />
        <CatalogStatus isPending={isPending} isUpdating={isUpdating} total={data?.total} />
        <CatalogResults search={search} onSearchChange={onSearchChange} isUpdating={isUpdating} />
        {data && <CatalogPager page={data.page} totalPages={data.totalPages} onSearchChange={onSearchChange} />}
      </div>
    </section>
  )
}
