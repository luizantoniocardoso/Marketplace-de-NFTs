import { NAV_ITEMS } from '../model'
import { HeaderNavLink } from './HeaderNavLink'

export function HeaderNav() {
  return (
    <nav aria-label="Principal" className="absolute left-1/2 hidden h-[68px] -translate-x-[54%] lg:block">
      <ul className="flex h-full items-center gap-10">
        {NAV_ITEMS.map((item) => (
          <li key={item.label} className="h-full">
            <HeaderNavLink item={item} />
          </li>
        ))}
      </ul>
    </nav>
  )
}
