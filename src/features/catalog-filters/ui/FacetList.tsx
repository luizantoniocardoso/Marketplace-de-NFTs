import { useId } from 'react'
import type { FacetOption } from '@/shared/contracts'
import { FacetListSkeleton } from './FacetListSkeleton'
import { FacetOptionButton } from './FacetOptionButton'

interface FacetListProps<T extends string> {
  title: string
  options?: FacetOption<T>[]
  selected?: T[]
  onToggle: (value: T) => void
  skeletonRows: number
  emphasizeCount?: boolean
}

export function FacetList<T extends string>({
  title,
  options,
  selected,
  onToggle,
  skeletonRows,
  emphasizeCount = false,
}: FacetListProps<T>) {
  const headingId = useId()

  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="text-body-lg font-bold">
        {title}
      </h2>
      <ul className="mt-2 flex flex-col">
        {options ? (
          options.map((option) => (
            <li key={option.value}>
              <FacetOptionButton
                label={option.label}
                count={option.count}
                active={selected?.includes(option.value) ?? false}
                emphasizeCount={emphasizeCount}
                onClick={() => onToggle(option.value)}
              />
            </li>
          ))
        ) : (
          <FacetListSkeleton rows={skeletonRows} />
        )}
      </ul>
    </section>
  )
}
