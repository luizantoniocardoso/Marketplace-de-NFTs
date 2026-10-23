import { countActiveFilters } from '@/entities/nft'
import { CatalogFilters } from '@/features/catalog-filters'
import { CatalogSort } from '@/features/catalog-sort'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/shared/ui'
import { useCatalog, type CatalogControls } from '../model'
import { FiltersButton } from './FiltersButton'

export function CatalogFiltersSheet({ search, onSearchChange }: CatalogControls) {
  const { data } = useCatalog(search)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <FiltersButton activeCount={countActiveFilters(search)} />
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[85dvh] overflow-y-auto rounded-t-3xl border-border bg-surface-card">
        <div className="px-5 pt-6 pb-8">
          <SheetTitle className="text-title font-bold">Filtros</SheetTitle>
          <SheetDescription className="mt-1 text-body text-text-secondary">
            Combine coleções, faixa de preço e rede.
          </SheetDescription>
          <div className="mt-6">
            <CatalogSort value={search.sort} onChange={(sort) => onSearchChange({ sort })} />
          </div>
          <CatalogFilters className="mt-6" facets={data?.facets} value={search} onChange={onSearchChange} />
          <SheetClose asChild>
            <button
              type="button"
              className="mt-8 h-11 w-full rounded-md bg-brand text-body-md font-bold text-ink hover:bg-brand-light"
            >
              {data ? `Ver ${data.total} resultados` : 'Ver resultados'}
            </button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  )
}
