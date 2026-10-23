import { PROMOS } from '../model'
import { PromoCard } from './PromoCard'

export function PromoBanners() {
  return (
    <section aria-label="Coleções em destaque" className="page-container mt-20 md:mt-[116px]">
      <ul className="grid gap-6 lg:grid-cols-2 lg:gap-7">
        {PROMOS.map((promo) => (
          <li key={promo.title}>
            <PromoCard promo={promo} />
          </li>
        ))}
      </ul>
    </section>
  )
}
