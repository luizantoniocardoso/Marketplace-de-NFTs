import { Link } from '@tanstack/react-router'
import { CATALOG_SECTION_ID } from '@/shared/config'
import { NFT_COLLECTION_LABELS } from '@/shared/contracts'
import { FOOTER_COLLECTIONS } from '../model'
import { footerLinkClass } from './footer-link-class'
import { FooterLinkColumn } from './FooterLinkColumn'

export function FooterCollectionLinks() {
  return (
    <FooterLinkColumn title="Coleções">
      {FOOTER_COLLECTIONS.map((collection) => (
        <li key={collection}>
          <Link to="/" search={{ collections: [collection] }} hash={CATALOG_SECTION_ID} className={footerLinkClass}>
            {NFT_COLLECTION_LABELS[collection]}
          </Link>
        </li>
      ))}
    </FooterLinkColumn>
  )
}
