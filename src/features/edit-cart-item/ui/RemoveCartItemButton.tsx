import { Trash2 } from 'lucide-react'
import type { CartItemDto } from '@/shared/contracts'
import { cn } from '@/shared/lib'
import { useRemoveCartItem } from '../model'

interface RemoveCartItemButtonProps {
  item: CartItemDto
  className?: string
}

export function RemoveCartItemButton({ item, className }: RemoveCartItemButtonProps) {
  const remove = useRemoveCartItem()

  return (
    <button
      type="button"
      onClick={() => remove.mutate(item)}
      disabled={remove.isPending}
      aria-label={`Remover ${item.name} (${item.editionLabel}) do carrinho`}
      className={cn(
        'grid size-9 place-items-center rounded-md text-text-secondary transition-colors hover:text-coral disabled:opacity-50',
        className,
      )}
    >
      <Trash2 className="size-5" aria-hidden="true" />
    </button>
  )
}
