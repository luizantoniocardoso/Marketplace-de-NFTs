import { FOOTER_FEATURES } from '../model'
import { FooterFeature } from './FooterFeature'
import { FooterNewsletter } from './FooterNewsletter'

export function FooterHighlights() {
  return (
    <section aria-label="Destaques da Kurio" className="bg-surface-card px-6 py-8 md:px-12">
      <div className="grid gap-8 *:min-w-0 md:grid-cols-2 xl:grid-cols-[266px_266px_266px_1fr] xl:gap-0">
        {FOOTER_FEATURES.map((feature) => (
          <FooterFeature key={feature.letter} feature={feature} />
        ))}
        <FooterNewsletter />
      </div>
    </section>
  )
}
