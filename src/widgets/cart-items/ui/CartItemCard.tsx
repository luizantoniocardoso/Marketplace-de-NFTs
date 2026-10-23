import { CartItemQuantity, RemoveCartItemButton } from '@/features/edit-cart-item'
import type { CartItemDto } from '@/shared/contracts'
import { formatEth } from '@/shared/lib'
import { CartItemStatus } from './CartItemStatus'

export function CartItemCard({ item }: { item: CartItemDto }) {
  return (
    <article className="relative flex h-[100px] overflow-hidden rounded-[10px] bg-surface-card">
      <img
        src={item.image.small}
        alt={item.image.alt}
        width={100}
        height={100}
        loading="lazy"
        className="size-[100px] shrink-0 object-cover"
      />
      <div className="flex min-w-0 flex-1 flex-col justify-center py-2 pr-3 pl-2.5">
        <h3 className="truncate text-body font-bold text-foreground">{item.name}</h3>
        <p className="text-body text-text-secondary">Edição: {item.editionLabel}</p>
        <CartItemStatus item={item} className="truncate" />
        <p className="mt-auto text-body-lg font-bold text-text-accent">
          <span className="sr-only">Total: </span>
          {formatEth(item.lineTotalEth)}
        </p>
      </div>
      <div className="flex flex-col items-end justify-between py-1 pr-2">
        <RemoveCartItemButton item={item} className="size-8" />
        <CartItemQuantity item={item} className="mb-3 [&_button]:size-[22px] [&_button]:border [&_button]:border-border-soft [&_button]:bg-transparent [&_button]:text-foreground [&_button:disabled]:bg-surface-raised" />
      </div>
    </article>
  )
}
