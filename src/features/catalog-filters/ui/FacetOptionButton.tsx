import { cn } from '@/shared/lib'

interface FacetOptionButtonProps {
  label: string
  count: number
  active: boolean
  emphasizeCount: boolean
  onClick: () => void
}

export function FacetOptionButton({ label, count, active, emphasizeCount, onClick }: FacetOptionButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'flex h-[34px] w-full items-center justify-between rounded-sm px-2.5 text-left text-body transition-colors hover:text-text-accent',
        active ? 'font-medium text-text-accent' : 'text-text-secondary',
      )}
    >
      <span>{label}</span>
      <span
        className={cn(
          emphasizeCount && 'font-bold',
          emphasizeCount && !active && 'text-foreground',
          active && 'text-text-accent',
        )}
      >
        <span className="sr-only">, </span>({count})
        <span className="sr-only"> itens</span>
      </span>
    </button>
  )
}
