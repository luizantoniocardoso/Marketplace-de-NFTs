import { CatalogMobileBar, CatalogSection } from '@/widgets/catalog'
import { HeroCarousel } from '@/widgets/hero-carousel'
import { Journal } from '@/widgets/journal'
import { PromoBanners } from '@/widgets/promo-banners'
import { useCatalogSearch } from '../model'

export function HomePage() {
  const controls = useCatalogSearch()

  return (
    <>
      <CatalogMobileBar {...controls} />
      <HeroCarousel />
      <div className="mt-6 md:mt-24">
        <CatalogSection {...controls} />
      </div>
      <PromoBanners />
      <Journal />
    </>
  )
}
