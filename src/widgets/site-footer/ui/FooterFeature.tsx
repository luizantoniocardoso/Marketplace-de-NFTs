import type { FooterFeature as FooterFeatureData } from '../model'

export function FooterFeature({ feature }: { feature: FooterFeatureData }) {
  return (
    <div className="xl:border-r xl:border-brand xl:pr-4 xl:not-first:pl-[18px]">
      <span
        aria-hidden="true"
        className="grid size-16 place-items-center rounded-full bg-brand text-title font-bold text-ink md:size-[74px] md:text-[22px]"
      >
        {feature.letter}
      </span>
      <h3 className="mt-5 text-body-lg font-bold wrap-break-word">{feature.title}</h3>
      <p className="mt-2 max-w-[220px] text-body text-text-secondary">{feature.text}</p>
    </div>
  )
}
