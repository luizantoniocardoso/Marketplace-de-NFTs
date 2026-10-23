import { useState } from 'react'
import { Slider } from '@/shared/ui'
import { formatPriceRange, fromCents, toCents } from '../lib'

export interface PriceRangeValue {
  minPrice?: string
  maxPrice?: string
}

interface PriceRangeSliderProps extends PriceRangeValue {
  bounds: { min: string; max: string }
  labelledBy: string
  onApply: (range: PriceRangeValue) => void
}

export function PriceRangeSlider({ bounds, minPrice, maxPrice, labelledBy, onApply }: PriceRangeSliderProps) {
  const lowest = toCents(bounds.min)
  const highest = toCents(bounds.max)
  const [range, setRange] = useState<[number, number]>(() => [
    minPrice ? toCents(minPrice) : lowest,
    maxPrice ? toCents(maxPrice) : highest,
  ])
  const [from, to] = range

  const apply = () =>
    onApply({
      minPrice: from > lowest ? fromCents(from) : undefined,
      maxPrice: to < highest ? fromCents(to) : undefined,
    })

  return (
    <>
      <Slider
        className="mt-4 px-2.5"
        min={lowest}
        max={highest}
        step={1}
        minStepsBetweenThumbs={1}
        value={range}
        onValueChange={(value) => setRange([value[0], value[1]])}
        aria-labelledby={labelledBy}
        thumbLabels={['Preço mínimo', 'Preço máximo']}
      />
      <p className="mt-3 px-2.5 text-body text-foreground" aria-live="polite">
        Preço: {formatPriceRange(from, to)}
      </p>
      <button
        type="button"
        onClick={apply}
        className="mt-2 ml-2.5 h-9 rounded-md bg-brand px-3 text-body-md font-bold text-ink transition-colors hover:bg-brand-light"
      >
        Aplicar
      </button>
    </>
  )
}
