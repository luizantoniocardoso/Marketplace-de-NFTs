import { Link } from '@tanstack/react-router'
import { LogIn, ShoppingCart } from 'lucide-react'
import { HeaderMenuButton } from './HeaderMenuButton'
import { HeaderSearch } from './HeaderSearch'

export function HeaderActions() {
  return (
    <div className="flex items-center gap-5">
      <HeaderSearch />
      <Link
        to="/cart"
        aria-label="Carrinho"
        className="relative grid size-9 place-items-center rounded-md text-foreground hover:text-text-accent"
      >
        <ShoppingCart className="size-6" aria-hidden="true" />
      </Link>
      <Link
        to="/login"
        className="flex h-8 items-center gap-1.5 rounded-md bg-brand px-2 text-body-md font-medium text-ink transition-colors hover:bg-brand-light"
      >
        <LogIn className="size-[18px]" aria-hidden="true" />
        Entrar
      </Link>
      <HeaderMenuButton />
    </div>
  )
}
