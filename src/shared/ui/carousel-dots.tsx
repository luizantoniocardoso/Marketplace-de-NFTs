import { cn } from '@/shared/lib'

interface CarouselDotsProps {
  count: number
  current: number
  onSelect: (index: number) => void
  label: string
  itemLabel: (index: number) => string
  className?: string
}

function CarouselDots({ count, current, onSelect, label, itemLabel, className }: CarouselDotsProps) {
  return (
    <div data-slot="carousel-dots" role="group" aria-label={label} className={cn('flex', className)}>
      {Array.from({ length: count }, (_, index) => (
        <button
          key={index}
          type="button"
          aria-label={itemLabel(index)}
          aria-current={index === current ? 'true' : undefined}
          onClick={() => onSelect(index)}
          className="grid size-6 place-items-center"
        >
          <span
            className={cn(
              'size-2 rounded-full bg-brand transition-opacity',
              index === current ? 'opacity-100' : 'opacity-60',
            )}
          />
        </button>
      ))}
    </div>
  )
}

export { CarouselDots }
