import { Loader2, MailCheck, XCircle } from 'lucide-react'
import type { OrderStatus } from '@/shared/contracts'

const COPY: Record<OrderStatus, string> = {
  pending: 'Aguardando a confirmação da rede…',
  confirmed: 'Seus NFTs agora estão na sua carteira',
  declined: 'Pagamento recusado',
}

export function ReceiptHeader({ status }: { status: OrderStatus }) {
  return (
    <div className="flex flex-col items-center gap-4 px-6 pt-6 pb-5 text-center">
      {status === 'confirmed' && <MailCheck className="size-[72px] text-brand" strokeWidth={1.25} aria-hidden="true" />}
      {status === 'pending' && (
        <Loader2 className="size-16 animate-spin text-brand motion-reduce:animate-none" aria-hidden="true" />
      )}
      {status === 'declined' && <XCircle className="size-16 text-coral" strokeWidth={1.5} aria-hidden="true" />}
      <h1 role="status" aria-live="polite" className="text-body-md font-bold text-text-secondary">
        {COPY[status]}
      </h1>
    </div>
  )
}
