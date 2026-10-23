import { Link } from '@tanstack/react-router'
import { ComingSoon } from '@/shared/ui'
import { FOOTER_PROFILE_LINKS } from '../model'
import { footerLinkClass } from './footer-link-class'
import { FooterLinkColumn } from './FooterLinkColumn'

export function FooterProfileLinks() {
  return (
    <FooterLinkColumn title="Meu perfil">
      <li>
        <Link to="/profile" className={footerLinkClass}>
          Meu perfil
        </Link>
      </li>
      {FOOTER_PROFILE_LINKS.map((label) => (
        <li key={label}>
          <ComingSoon>{label}</ComingSoon>
        </li>
      ))}
    </FooterLinkColumn>
  )
}
