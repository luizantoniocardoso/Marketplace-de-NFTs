import { Link } from '@tanstack/react-router'
import { AlertTriangle, ShoppingCart } from 'lucide-react'
import { useCart } from '@/entities/cart'
import { getApiError } from '@/shared/api'
import { Button, Skeleton, StateMessage } from '@/shared/ui'
import { CartChangesNotice } from './CartChangesNotice'
import { CartItemCard } from './CartItemCard'
import { CartTable } from './CartTable'

export function CartItems() {
  const { data: cart, error, isPending, refetch } = useCart()

  if (!isPending && !cart) {
    return (
      <StateMessage
        role="alert"
        icon={AlertTriangle}
        iconClassName="text-coral"
        title="Não foi possível carregar o carrinho"
        description={getApiError(error).message}
        action={
          <Button variant="brand" size="md" onClick={() => refetch()}>
            Tentar novamente
          </Button>
        }
      />
    )
  }

  if (cart && !cart.items.length) {
    return (
      <StateMessage
        icon={ShoppingCart}
        title="Seu carrinho está vazio"
        description="Explore o catálogo e adicione NFTs para continuar."
        action={
          <Button asChild variant="brand" size="md">
            <Link to="/">Explorar NFTs</Link>
          </Button>
        }
      />
    )
  }

  return (
    <div aria-busy={isPending} className="flex flex-col gap-4">
      {cart && <CartChangesNotice items={cart.items} />}
      <CartTable items={cart?.items} />
      <ul className="flex flex-col gap-5 md:hidden">
        {cart
          ? cart.items.map((item) => (
              <li key={item.id}>
                <CartItemCard item={item} />
              </li>
            ))
          : Array.from({ length: 3 }, (_, index) => (
              <li key={index}>
                <Skeleton className="h-[100px] w-full rounded-[10px]" />
              </li>
            ))}
      </ul>
    </div>
  )
}
