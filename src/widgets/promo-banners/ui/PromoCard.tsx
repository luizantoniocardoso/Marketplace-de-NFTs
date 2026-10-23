import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { CATALOG_SECTION_ID } from '@/shared/config'
import { artworkUrl } from '@/shared/lib'
import type { Promo } from '../model'

export function PromoCard({ promo }: { promo: Promo }) {
  return (
    <div className="flex min-h-[210px] overflow-hidden rounded-2xl bg-surface-card md:h-[250px] md:rounded-none md:rounded-r-xl">
      <img
        src={artworkUrl(promo.artwork, 480)}
        width={287}
        height={250}
        loading="lazy"
        decoding="async"
        alt={promo.alt}
        className="w-[42%] shrink-0 self-stretch rounded-3xl object-cover md:w-[287px]"
      />
      <div className="flex min-w-0 flex-1 flex-col items-end justify-center gap-2 px-4 py-4 text-right md:px-6">
        <h3 className="text-body-lg font-bold md:text-[18px] md:leading-6">{promo.title}</h3>
        <p className="text-caption text-text-secondary md:text-body">{promo.text}</p>
        <Link
          to="/"
          search={promo.search}
          hash={CATALOG_SECTION_ID}
          className="mt-1 inline-flex h-9 items-center gap-1 rounded-[3px] bg-brand px-6 text-body-md font-medium text-ink transition-colors hover:bg-brand-light"
        >
          Explorar <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}
