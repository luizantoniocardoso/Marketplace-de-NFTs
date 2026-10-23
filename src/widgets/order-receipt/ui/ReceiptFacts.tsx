import { WALLET_PROVIDER_LABELS, type OrderDto } from '@/shared/contracts'
import { formatEth, formatShortDate, shortenAddress } from '@/shared/lib'

export function ReceiptFacts({ order }: { order: OrderDto }) {
  const facts = [
    {
      term: order.transactionHash ? 'ID da transação' : 'Pedido',
      value: order.transactionHash ? shortenAddress(order.transactionHash) : order.id,
    },
    { term: 'Data', value: formatShortDate(order.createdAt) },
    { term: 'Total', value: formatEth(order.totalEth, { maxDecimals: 6 }) },
    { term: 'Carteira', value: WALLET_PROVIDER_LABELS[order.provider] },
  ]

  return (
    <dl className="grid grid-cols-2 gap-y-3 border-y border-brand px-6 py-3 sm:grid-cols-[1.25fr_1fr_1fr_1fr] sm:px-9">
      {facts.map((fact, index) => (
        <div key={fact.term} className={index > 0 ? 'sm:border-l sm:border-brand sm:pl-4' : undefined}>
          <dt className={index === 0 || index === 3 ? "whitespace-nowrap text-body font-bold text-text-secondary" : "whitespace-nowrap text-body text-text-secondary"}>
            {fact.term}
          </dt>
          <dd className="truncate text-body text-text-secondary">{fact.value}</dd>
        </div>
      ))}
    </dl>
  )
}
