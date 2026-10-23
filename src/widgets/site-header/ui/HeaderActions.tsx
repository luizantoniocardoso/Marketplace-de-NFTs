import { HeaderAccount } from './HeaderAccount'
import { HeaderCartLink } from './HeaderCartLink'
import { HeaderMenuButton } from './HeaderMenuButton'
import { HeaderSearch } from './HeaderSearch'

export function HeaderActions() {
  return (
    <div className="flex items-center gap-5">
      <HeaderSearch />
      <HeaderCartLink />
      <HeaderAccount />
      <HeaderMenuButton />
    </div>
  )
}
