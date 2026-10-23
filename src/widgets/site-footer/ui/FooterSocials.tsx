import { FOOTER_SOCIALS, FOOTER_WALLETS } from '../model'

export function FooterSocials() {
  return (
    <div>
      <h2 className="text-body-lg font-bold">Redes sociais</h2>
      <ul className="mt-3 flex gap-2">
        {FOOTER_SOCIALS.map(({ label, Icon }) => (
          <li key={label}>
            <span
              role="img"
              aria-label={`${label} (em breve)`}
              title="Em breve"
              className="grid size-8 place-items-center rounded border border-brand text-brand"
            >
              <Icon className="size-4" aria-hidden="true" />
            </span>
          </li>
        ))}
      </ul>
      <h2 className="mt-6 text-body-lg font-bold">Carteiras compatíveis</h2>
      <p className="mt-2 inline-flex rounded border border-brand-dark bg-surface-dark px-2 py-1 text-[9px] font-bold tracking-wide text-text-accent">
        {FOOTER_WALLETS.join(' · ')}
      </p>
    </div>
  )
}
