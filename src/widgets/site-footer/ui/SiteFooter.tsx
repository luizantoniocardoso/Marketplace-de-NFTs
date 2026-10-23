import { FooterContact } from './FooterContact'
import { FooterHighlights } from './FooterHighlights'
import { FooterLinks } from './FooterLinks'

export function SiteFooter() {
  return (
    <footer className="page-container mt-24 pb-28 md:pb-0">
      <FooterHighlights />
      <FooterContact />
      <FooterLinks />
      <p className="py-5 text-center text-body text-foreground">© 2026 Kurio. Propriedade digital para todos.</p>
    </footer>
  )
}
