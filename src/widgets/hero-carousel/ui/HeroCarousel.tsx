import { HERO_SLIDES, useCarousel } from '../model'
import { HeroDots } from './HeroDots'
import { HeroSlideDesktop } from './HeroSlideDesktop'
import { HeroSlideMobile } from './HeroSlideMobile'

export function HeroCarousel() {
  const { index, goTo, handlers } = useCarousel(HERO_SLIDES.length)
  const slide = HERO_SLIDES[index]
  const priority = index === 0

  return (
    <section aria-roledescription="carrossel" aria-label="Destaques" {...handlers}>
      <div aria-roledescription="slide" aria-label={`${index + 1} de ${HERO_SLIDES.length}`} aria-live="polite">
        <HeroSlideMobile
          slide={slide}
          priority={priority}
          dots={<HeroDots current={index} onSelect={goTo} className="absolute inset-x-0 bottom-0 justify-center" />}
        />
        <HeroSlideDesktop
          slide={slide}
          priority={priority}
          dots={<HeroDots current={index} onSelect={goTo} className="mt-auto mr-[60px] mb-10 self-end" />}
        />
      </div>
    </section>
  )
}
