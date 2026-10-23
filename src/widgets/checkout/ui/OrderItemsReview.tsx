import type { CartItemDto } from '@/shared/contracts'
import { cn, formatEth } from '@/shared/lib'
import { Skeleton } from '@/shared/ui'

interface OrderItemsReviewProps {
  items?: CartItemDto[]
  className?: string
}

export function OrderItemsReview({ items, className }: OrderItemsReviewProps) {
  return (
    <section aria-labelledby="checkout-items-title" className={className}>
      <h2 id="checkout-items-title" className="text-body-lg font-bold text-foreground">
        Seus NFTs
      </h2>
      <div className="mt-1 flex justify-between text-body-md font-bold text-foreground">
        <span>NFTs</span>
        <span>Subtotal</span>
      </div>
      <ul className="mt-3 flex flex-col gap-3">
        {items
          ? items.map((item) => (
              <li key={item.id} className="flex h-[70px] items-center gap-2 bg-surface-card pr-4 pl-1">
                <img src={item.image.small} alt="" width={66} height={66} loading="lazy" className="size-[66px] rounded-[6px] object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-body-md font-bold text-foreground">{item.name}</p>
                  <p className="truncate text-body text-text-secondary">ID do token: {item.tokenId}</p>
                </div>
                <span className="text-caption text-text-secondary">
                  <span className="sr-only">Quantidade: </span>(x {item.quantity})
                </span>
                <span className={cn('w-[92px] text-right text-body-lg font-bold text-text-accent', item.status !== 'ok' && 'text-amber')}>
                  {formatEth(item.lineTotalEth)}
                </span>
              </li>
            ))
          : Array.from({ length: 3 }, (_, index) => <Skeleton key={index} className="h-[70px] w-full" />)}
      </ul>
    </section>
  )
}
