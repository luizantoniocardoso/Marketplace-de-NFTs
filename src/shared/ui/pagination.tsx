import { cn } from '@/shared/lib'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  label: string
  maxVisible?: number
  className?: string
}

const itemClass =
  'grid size-[34px] place-items-center rounded-[3px] border border-border-soft text-body-md text-foreground transition-colors hover:border-brand hover:text-text-accent disabled:pointer-events-none disabled:opacity-40'

function visiblePages(page: number, totalPages: number, maxVisible: number) {
  const size = Math.min(maxVisible, totalPages)
  const start = Math.min(Math.max(1, page - Math.floor(size / 2)), totalPages - size + 1)
  return Array.from({ length: size }, (_, index) => start + index)
}

function Pagination({ page, totalPages, onPageChange, label, maxVisible = 5, className }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <nav data-slot="pagination" aria-label={label} className={className}>
      <ul className="flex items-center gap-1.5">
        {page > 1 && (
          <li>
            <button type="button" aria-label="Página anterior" className={itemClass} onClick={() => onPageChange(page - 1)}>
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
          </li>
        )}
        {visiblePages(page, totalPages, maxVisible).map((number) => (
          <li key={number}>
            <button
              type="button"
              aria-label={`Página ${number}`}
              aria-current={number === page ? 'page' : undefined}
              onClick={() => onPageChange(number)}
              className={cn(itemClass, number === page && 'border-brand bg-brand font-bold text-ink hover:text-ink')}
            >
              {number}
            </button>
          </li>
        ))}
        <li>
          <button
            type="button"
            aria-label="Próxima página"
            disabled={page >= totalPages}
            className={itemClass}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </li>
      </ul>
    </nav>
  )
}

export { Pagination }
