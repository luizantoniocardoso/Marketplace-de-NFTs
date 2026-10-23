import { AlertTriangle } from 'lucide-react'
import { useAcknowledgeCartChanges } from '@/features/edit-cart-item'
import type { CartItemDto } from '@/shared/contracts'
import { Button } from '@/shared/ui'

export function CartChangesNotice({ items }: { items: CartItemDto[] }) {
  const acknowledge = useAcknowledgeCartChanges()
  const changed = items.filter((item) => item.status !== 'ok')
  if (!changed.length) return null

  const soldOut = changed.some((item) => item.status === 'unavailable')

  return (
    <div
      role="status"
      className="flex flex-col gap-3 rounded-[4px] border border-amber/60 bg-amber/10 p-4 sm:flex-row sm:items-center"
    >
      <AlertTriangle className="size-5 shrink-0 text-amber" aria-hidden="true" />
      <p className="flex-1 text-body text-foreground">
        {soldOut
          ? 'Alguns itens esgotaram ou têm estoque menor enquanto você navegava.'
          : 'O preço de alguns itens mudou enquanto você navegava.'}{' '}
        O resumo já reflete os novos valores.
      </p>
      <Button variant="brand-outline" size="md" onClick={() => acknowledge.mutate()} disabled={acknowledge.isPending}>
        {soldOut ? 'Ajustar carrinho' : 'Entendi'}
      </Button>
    </div>
  )
}
