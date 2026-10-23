import { Link } from '@tanstack/react-router'
import { X } from 'lucide-react'
import type { OrderDto } from '@/shared/contracts'
import { ReceiptFacts } from './ReceiptFacts'
import { ReceiptFooter } from './ReceiptFooter'
import { ReceiptHeader } from './ReceiptHeader'
import { ReceiptLines } from './ReceiptLines'

export function OrderReceipt({ order }: { order: OrderDto }) {
  return (
    <article aria-label="Recibo do pedido" className="relative mx-auto w-full max-w-[578px] bg-surface-card">
      <Link
        to="/"
        aria-label="Fechar e voltar ao início"
        className="absolute top-3 right-3 grid size-9 place-items-center text-brand hover:text-brand-light"
      >
        <X className="size-5" aria-hidden="true" />
      </Link>
      <ReceiptHeader status={order.status} />
      <ReceiptFacts order={order} />
      <ReceiptLines order={order} />
      <ReceiptFooter order={order} />
      <div aria-hidden="true" className="h-2.5 bg-brand" />
    </article>
  )
}
