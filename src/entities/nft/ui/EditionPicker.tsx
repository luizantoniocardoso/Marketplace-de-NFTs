import { useId } from 'react'
import type { NftEditionDto } from '@/shared/contracts'
import { cn } from '@/shared/lib'

interface EditionPickerProps {
  editions: NftEditionDto[]
  value: string
  onChange: (editionId: string) => void
  label?: string
  className?: string
}

export function EditionPicker({ editions, value, onChange, label = 'Edição:', className }: EditionPickerProps) {
  const labelId = useId()

  return (
    <div className={className}>
      <p id={labelId} className="text-body font-bold text-foreground">
        {label}
      </p>
      <div role="group" aria-labelledby={labelId} className="mt-2 flex flex-wrap gap-2">
        {editions.map((edition) => {
          const selected = edition.id === value
          const soldOut = edition.available === 0
          return (
            <button
              key={edition.id}
              type="button"
              aria-pressed={selected}
              aria-disabled={soldOut || undefined}
              disabled={soldOut}
              onClick={() => onChange(edition.id)}
              title={soldOut ? 'Edição esgotada' : undefined}
              className={cn(
                'h-6 rounded-full border px-2 text-caption uppercase transition-colors md:h-[25px]',
                selected
                  ? 'border-brand text-foreground'
                  : 'border-border-soft text-text-secondary hover:border-brand hover:text-foreground',
                soldOut && 'cursor-not-allowed line-through opacity-50 hover:border-border-soft',
              )}
            >
              {edition.label}
              {soldOut && <span className="sr-only"> (esgotada)</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
