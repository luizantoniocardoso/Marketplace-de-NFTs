import { Link } from '@tanstack/react-router'
import { ShoppingCart } from 'lucide-react'
import { useCartCount } from '@/entities/cart'

export function HeaderCartLink() {
  const count = useCartCount()

  return (
    <Link
      to="/cart"
      aria-label={count ? `Carrinho, ${count} ${count === 1 ? 'item' : 'itens'}` : 'Carrinho'}
      className="relative grid size-9 place-items-center rounded-md text-foreground hover:text-text-accent"
    >
      <ShoppingCart className="size-6" aria-hidden="true" />
      {count > 0 && (
        <span
          aria-hidden="true"
          className="absolute top-0 right-0 grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[9px] leading-none font-bold text-ink"
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  )
}
