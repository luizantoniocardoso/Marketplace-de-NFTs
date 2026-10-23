import { CarouselDots } from '@/shared/ui'
import { HERO_SLIDES } from '../model'

interface HeroDotsProps {
  current: number
  onSelect: (index: number) => void
  className?: string
}

export function HeroDots({ current, onSelect, className }: HeroDotsProps) {
  return (
    <CarouselDots
      count={HERO_SLIDES.length}
      current={current}
      onSelect={onSelect}
      label="Escolher destaque"
      itemLabel={(index) => `Destaque ${index + 1} de ${HERO_SLIDES.length}`}
      className={className}
    />
  )
}
