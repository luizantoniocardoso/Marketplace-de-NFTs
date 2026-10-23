import { FooterCollectionLinks } from './FooterCollectionLinks'
import { FooterHelpLinks } from './FooterHelpLinks'
import { FooterProfileLinks } from './FooterProfileLinks'
import { FooterSocials } from './FooterSocials'

export function FooterLinks() {
  return (
    <div className="grid gap-8 bg-surface-card px-6 py-8 sm:grid-cols-2 md:px-8 xl:grid-cols-4">
      <FooterProfileLinks />
      <FooterHelpLinks />
      <FooterCollectionLinks />
      <FooterSocials />
    </div>
  )
}
