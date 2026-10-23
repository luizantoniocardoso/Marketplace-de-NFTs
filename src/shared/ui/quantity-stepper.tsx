import { cn } from '@/shared/lib'
import { Minus, Plus } from 'lucide-react'

interface QuantityStepperProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max: number
  label: string
  disabled?: boolean
  size?: 'sm' | 'lg'
  className?: string
}

function QuantityStepper({
  value,
  onChange,
  min = 1,
  max,
  label,
  disabled,
  size = 'sm',
  className,
}: QuantityStepperProps) {
  const buttonClass = cn(
    'grid place-items-center rounded-full bg-brand text-ink transition-colors hover:bg-brand-light disabled:cursor-not-allowed disabled:bg-surface-raised disabled:text-text-secondary',
    size === 'lg' ? 'h-10 w-[29px]' : 'size-[19px] md:h-6 md:w-[19px]',
  )

  return (
    <div
      role="group"
      aria-label={label}
      className={cn('flex items-center', size === 'lg' ? 'gap-3' : 'gap-2.5', className)}
    >
      <button
        type="button"
        className={buttonClass}
        disabled={disabled || value <= min}
        onClick={() => onChange(value - 1)}
        aria-label={`Diminuir ${label.toLowerCase()}`}
      >
        <Minus className={size === 'lg' ? 'size-5' : 'size-3'} strokeWidth={3} aria-hidden="true" />
      </button>
      <output
        aria-live="polite"
        className={cn('min-w-4 text-center text-foreground', size === 'lg' ? 'text-body-lg' : 'text-body-md')}
      >
        {value}
      </output>
      <button
        type="button"
        className={buttonClass}
        disabled={disabled || value >= max}
        onClick={() => onChange(value + 1)}
        aria-label={`Aumentar ${label.toLowerCase()}`}
      >
        <Plus className={size === 'lg' ? 'size-5' : 'size-3'} strokeWidth={3} aria-hidden="true" />
      </button>
    </div>
  )
}

export { QuantityStepper }
