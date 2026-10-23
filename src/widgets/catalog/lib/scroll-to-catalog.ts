import { CATALOG_SECTION_ID } from '@/shared/config'

export function scrollToCatalog() {
  document.getElementById(CATALOG_SECTION_ID)?.scrollIntoView({ block: 'start' })
}
