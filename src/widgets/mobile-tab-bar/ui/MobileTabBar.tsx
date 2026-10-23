import { Heart, House, ShoppingCart, User } from 'lucide-react'
import { SearchFab } from './SearchFab'
import { TabBarBackground } from './TabBarBackground'
import { TabBarLink } from './TabBarLink'

export function MobileTabBar() {
  return (
    <nav aria-label="Navegação inferior" className="fixed inset-x-0 bottom-0 z-40 md:hidden">
      <div className="relative mx-auto h-[84px] max-w-[480px] pb-[env(safe-area-inset-bottom)]">
        <TabBarBackground />
        <ul className="relative grid h-full grid-cols-5 items-end pb-3 [&>li]:grid [&>li]:place-items-center">
          <li>
            <TabBarLink to="/" label="Início">
              <House className="size-6" fill="currentColor" aria-hidden="true" />
            </TabBarLink>
          </li>
          <li>
            <TabBarLink to="/favorites" label="Favoritos">
              <Heart className="size-6" fill="currentColor" aria-hidden="true" />
            </TabBarLink>
          </li>
          <li>
            <SearchFab />
          </li>
          <li>
            <TabBarLink to="/cart" label="Carrinho">
              <ShoppingCart className="size-6" aria-hidden="true" />
            </TabBarLink>
          </li>
          <li>
            <TabBarLink to="/profile" label="Perfil">
              <User className="size-6" fill="currentColor" aria-hidden="true" />
            </TabBarLink>
          </li>
        </ul>
      </div>
    </nav>
  )
}
