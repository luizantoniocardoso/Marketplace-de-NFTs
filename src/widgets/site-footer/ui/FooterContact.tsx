import { Logo } from '@/shared/ui'
import { FOOTER_CONTACT } from '../model'
import { footerLinkClass } from './footer-link-class'

export function FooterContact() {
  return (
    <div className="grid gap-4 bg-surface-dark px-6 py-6 text-body text-foreground sm:grid-cols-2 md:px-8 xl:h-[88px] xl:grid-cols-4 xl:items-center xl:py-0">
      <p>
        <Logo />
      </p>
      <p className="max-w-[260px]">{FOOTER_CONTACT.tagline}</p>
      <a href={`mailto:${FOOTER_CONTACT.email}`} className={footerLinkClass}>
        {FOOTER_CONTACT.email}
      </a>
      <a href={FOOTER_CONTACT.phone.href} className={footerLinkClass}>
        {FOOTER_CONTACT.phone.label}
      </a>
    </div>
  )
}
