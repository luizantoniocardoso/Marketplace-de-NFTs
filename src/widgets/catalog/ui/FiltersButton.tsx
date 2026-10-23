import { SlidersHorizontal } from 'lucide-react'
import type { ComponentProps } from 'react'

interface FiltersButtonProps extends ComponentProps<'button'> {
  activeCount: number
}

export function FiltersButton({ activeCount, ...props }: FiltersButtonProps) {
  return (
    <button
      type="button"
      aria-label={activeCount ? `Filtros (${activeCount} ativos)` : 'Filtros'}
      className="relative grid size-11 shrink-0 place-items-center rounded-[10px] bg-gradient-to-br from-brand-light to-brand-dark text-ink"
      {...props}
    >
      <SlidersHorizontal className="size-5" aria-hidden="true" />
      {activeCount > 0 && (
        <span
          aria-hidden="true"
          className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-foreground text-tiny font-bold text-ink"
        >
          {activeCount}
        </span>
      )}
    </button>
  )
}
