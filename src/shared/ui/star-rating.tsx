import { cn } from '@/shared/lib'
import { Star } from 'lucide-react'

interface StarRatingProps {
  value: number
  max?: number
  className?: string
}

function StarRating({ value, max = 5, className }: StarRatingProps) {
  return (
    <span role="img" aria-label={`Nota ${value.toLocaleString('pt-BR')} de ${max}`} className={cn('inline-flex gap-1', className)}>
      {Array.from({ length: max }, (_, index) => (
        <Star
          key={index}
          aria-hidden="true"
          className={cn('size-3.5', index < Math.round(value) ? 'fill-text-secondary text-text-secondary' : 'text-border-soft')}
        />
      ))}
    </span>
  )
}

export { StarRating }
