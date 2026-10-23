import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { CATALOG_SECTION_ID } from '@/shared/config'
import { artworkUrl } from '@/shared/lib'
import type { HeroSlide } from '../model'

interface HeroSlideDesktopProps {
  slide: HeroSlide
  priority: boolean
  dots: ReactNode
}

export function HeroSlideDesktop({ slide, priority, dots }: HeroSlideDesktopProps) {
  return (
    <div className="page-container hidden md:block">
      <div className="grid grid-cols-[1fr_300px] items-start gap-8 pt-[33px] lg:grid-cols-[1fr_minmax(0,450px)]">
        <div className="flex h-full flex-col pt-6 lg:pt-10 lg:pl-10">
          <p className="text-body font-medium tracking-wide">Bem-vindo à Kurio</p>
          <h1 className="mt-1 text-[28px] leading-[44px] font-bold tracking-wide lg:text-display lg:leading-[70px]">
            {slide.title[0]}
            <br />
            {slide.title[1]}
          </h1>
          <p className="mt-1 max-w-[560px] text-body text-text-secondary">{slide.description}</p>
          <Link
            to="/"
            hash={CATALOG_SECTION_ID}
            className="mt-8 inline-flex h-10 w-fit items-center rounded-[3px] bg-brand px-[33px] text-body-md font-bold text-ink transition-colors hover:bg-brand-light"
          >
            EXPLORAR
          </Link>
          {dots}
        </div>
        <img
          src={artworkUrl(slide.artwork, 960)}
          width={450}
          height={450}
          alt={slide.alt}
          fetchPriority={priority ? 'high' : 'auto'}
          className="aspect-square w-full rounded-3xl object-cover"
        />
      </div>
    </div>
  )
}
