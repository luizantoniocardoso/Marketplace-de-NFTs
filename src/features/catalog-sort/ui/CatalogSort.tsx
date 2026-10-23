import { useId } from 'react'
import { NFT_SORT_LABELS, NFT_SORTS, type NftSort } from '@/shared/contracts'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui'

const DEFAULT_SORT: NftSort = 'recent'

interface CatalogSortProps {
  value?: NftSort
  onChange: (sort: NftSort | undefined) => void
}

export function CatalogSort({ value = DEFAULT_SORT, onChange }: CatalogSortProps) {
  const labelId = useId()

  return (
    <div className="flex items-center gap-1 text-body">
      <span id={labelId}>Ordenar por:</span>
      <Select value={value} onValueChange={(sort) => onChange(sort === DEFAULT_SORT ? undefined : (sort as NftSort))}>
        <SelectTrigger
          aria-labelledby={labelId}
          className="h-auto gap-1 border-0 bg-transparent p-0 text-body text-foreground shadow-none hover:text-text-accent focus-visible:ring-0 dark:bg-transparent dark:hover:bg-transparent"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="end" className="border-border bg-surface-raised">
          {NFT_SORTS.map((sort) => (
            <SelectItem key={sort} value={sort}>
              {NFT_SORT_LABELS[sort]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
