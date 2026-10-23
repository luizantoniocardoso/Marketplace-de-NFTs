import { useId } from 'react'
import { PriceRangeSkeleton } from './PriceRangeSkeleton'
import { PriceRangeSlider, type PriceRangeValue } from './PriceRangeSlider'

interface PriceRangeProps extends PriceRangeValue {
  bounds?: { min: string; max: string }
  onApply: (range: PriceRangeValue) => void
}

export function PriceRange({ bounds, minPrice, maxPrice, onApply }: PriceRangeProps) {
  const headingId = useId()

  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="text-body-lg font-bold">
        Faixa de preço
      </h2>
      {bounds ? (
        <PriceRangeSlider
          key={`${minPrice}-${maxPrice}-${bounds.min}-${bounds.max}`}
          bounds={bounds}
          minPrice={minPrice}
          maxPrice={maxPrice}
          labelledBy={headingId}
          onApply={onApply}
        />
      ) : (
        <PriceRangeSkeleton />
      )}
    </section>
  )
}
