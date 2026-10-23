import { editionLimit } from '@/entities/nft'
import type { CartItemDto } from '@/shared/contracts'
import { QuantityStepper } from '@/shared/ui'
import { useUpdateCartItem } from '../model'

interface CartItemQuantityProps {
  item: CartItemDto
  className?: string
}

export function CartItemQuantity({ item, className }: CartItemQuantityProps) {
  const update = useUpdateCartItem()
  const max = Math.max(item.quantity, editionLimit(item))

  return (
    <QuantityStepper
      value={item.quantity}
      max={max}
      label={`Quantidade de ${item.name}`}
      disabled={item.status === 'unavailable'}
      onChange={(quantity) => update.mutate({ item, quantity })}
      className={className}
    />
  )
}
