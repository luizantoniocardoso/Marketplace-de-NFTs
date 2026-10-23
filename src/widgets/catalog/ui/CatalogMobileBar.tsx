import { useCallback } from 'react'
import { SearchField } from '@/features/search-nfts'
import { MOBILE_SEARCH_INPUT_ID } from '@/shared/config'
import type { CatalogControls } from '../model'
import { CatalogFiltersSheet } from './CatalogFiltersSheet'

export function CatalogMobileBar({ search, onSearchChange }: CatalogControls) {
  const onSearch = useCallback((term: string) => onSearchChange({ q: term || undefined }), [onSearchChange])

  return (
    <div className="page-container flex gap-2.5 pt-10 md:hidden">
      <SearchField id={MOBILE_SEARCH_INPUT_ID} value={search.q ?? ''} onSearch={onSearch} formClassName="flex-1" />
      <CatalogFiltersSheet search={search} onSearchChange={onSearchChange} />
    </div>
  )
}
