import type { QuoteDto } from '@/shared/contracts'
import { cn, formatEth } from '@/shared/lib'
import { SummaryRow } from './SummaryRow'

interface QuoteSummaryProps {
  quote?: QuoteDto
  loading: boolean
  className?: string
}

export function QuoteSummary({ quote, loading, className }: QuoteSummaryProps) {
  const value = (amount?: string) => (amount ? formatEth(amount) : '—')

  return (
    <dl aria-busy={loading} className={cn('flex flex-col gap-3', className)}>
      <SummaryRow label="Subtotal" value={value(quote?.subtotalEth)} loading={loading} />
      <SummaryRow
        label="Desconto do lançamento"
        value={quote ? `(-) ${formatEth(quote.discountEth, { unit: false })}` : '—'}
        loading={loading}
        hint={quote?.coupon ? quote.coupon.description : undefined}
      />
      <SummaryRow label="Taxa de rede" value={value(quote?.networkFeeEth)} loading={loading} hint="Taxa estimada" />
      <SummaryRow label="Total" value={value(quote?.totalEth)} loading={loading} emphasis className="mt-4" />
    </dl>
  )
}
