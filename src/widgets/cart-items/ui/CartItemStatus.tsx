import type { CartItemDto } from '@/shared/contracts'
import { cn, formatEth } from '@/shared/lib'

function cartItemStatusText(item: CartItemDto) {
  if (item.status === 'unavailable') return 'Edição esgotada'
  if (item.status === 'quantity_reduced') return `Restam apenas ${item.available}`
  if (item.status === 'price_changed' && item.previousUnitPriceEth) return `Preço atualizado (antes ${formatEth(item.previousUnitPriceEth)})`
  return null
}

export function CartItemStatus({ item, className }: { item: CartItemDto; className?: string }) {
  const text = cartItemStatusText(item)
  if (!text) return null

  return (
    <p className={cn('text-caption', item.status === 'price_changed' ? 'text-amber' : 'text-coral', className)}>{text}</p>
  )
}
