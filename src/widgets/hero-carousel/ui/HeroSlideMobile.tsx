import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { CATALOG_SECTION_ID } from '@/shared/config'
import { artworkUrl } from '@/shared/lib'
import type { HeroSlide } from '../model'

interface HeroSlideMobileProps {
  slide: HeroSlide
  priority: boolean
  dots: ReactNode
}

export function HeroSlideMobile({ slide, priority, dots }: HeroSlideMobileProps) {
  return (
    <div className="page-container mt-4 md:hidden">
      <div className="relative h-[188px] overflow-hidden rounded-3xl bg-gradient-to-r from-[#6e4a2c] via-[#4d311c] to-[#3a2414] px-4 pt-2.5">
        <span aria-hidden="true" className="absolute -top-16 left-24 size-64 rounded-full bg-white/[0.06]" />
        <span aria-hidden="true" className="absolute top-10 -left-20 size-56 rounded-full bg-black/[0.08]" />
        <div className="relative flex gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[12px] leading-4 font-medium">Bem-vindo à Kurio</p>
            <h1 className="mt-1 text-[18px] leading-[29px] font-bold tracking-wide">
              {slide.mobileTitle[0]}
              <br />
              {slide.mobileTitle[1]}
            </h1>
            <p className="mt-1 text-[12px] leading-[17.5px] text-[#c9b39a]">{slide.mobileDescription}</p>
            <Link
              to="/"
              hash={CATALOG_SECTION_ID}
              className="mt-1 inline-flex items-center gap-2 text-[12px] leading-4 font-bold text-brand"
            >
              EXPLORAR <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="relative w-[138px] shrink-0 self-start pt-[9px]">
            <img
              src={artworkUrl(slide.artwork, 480)}
              width={138}
              height={138}
              alt={slide.alt}
              fetchPriority={priority ? 'high' : 'auto'}
              className="aspect-square w-full rounded-2xl object-cover"
            />
            <img
              src={artworkUrl(slide.secondaryArtwork, 480)}
              width={58}
              height={58}
              alt=""
              className="absolute -bottom-4 left-3 size-[58px] rounded-xl border-2 border-[#4d311c] object-cover"
            />
          </div>
        </div>
        {dots}
      </div>
    </div>
  )
}
