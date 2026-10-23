import { Pagination } from '@/shared/ui'
import { scrollToCatalog } from '../lib'
import type { CatalogControls } from '../model'

interface CatalogPagerProps extends Pick<CatalogControls, 'onSearchChange'> {
  page: number
  totalPages: number
}

export function CatalogPager({ page, totalPages, onSearchChange }: CatalogPagerProps) {
  return (
    <div className="mt-14 flex justify-center md:mt-16 md:justify-end">
      <Pagination
        label="Paginação do catálogo"
        page={page}
        totalPages={totalPages}
        onPageChange={(next) => {
          onSearchChange({ page: next === 1 ? undefined : next })
          scrollToCatalog()
        }}
      />
    </div>
  )
}
