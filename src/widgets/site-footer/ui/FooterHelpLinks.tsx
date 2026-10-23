import { ComingSoon } from '@/shared/ui'
import { FOOTER_HELP_LINKS } from '../model'
import { FooterLinkColumn } from './FooterLinkColumn'

export function FooterHelpLinks() {
  return (
    <FooterLinkColumn title="Central de ajuda">
      {FOOTER_HELP_LINKS.map((label) => (
        <li key={label}>
          <ComingSoon>{label}</ComingSoon>
        </li>
      ))}
    </FooterLinkColumn>
  )
}
