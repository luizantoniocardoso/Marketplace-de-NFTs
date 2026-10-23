import { Link } from '@tanstack/react-router'
import { ExternalLink } from 'lucide-react'
import { NFT_NETWORK_LABELS, type NftNetwork, type OrderDto } from '@/shared/contracts'
import { Button } from '@/shared/ui'

const EXPLORER_NAMES: Record<NftNetwork, string> = {
  ethereum: 'Etherscan',
  polygon: 'Polygonscan',
  solana: 'Solscan',
}

export function ReceiptFooter({ order }: { order: OrderDto }) {
  const network = NFT_NETWORK_LABELS[order.network]

  if (order.status === 'declined') {
    return (
      <div className="flex flex-col items-center gap-5 px-6 py-6 text-center">
        <p className="max-w-[440px] text-body text-text-secondary">
          {order.failureReason ?? 'O pagamento não foi concluído.'} Seus itens continuam no carrinho.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild variant="brand" size="xl">
            <Link to="/checkout">Tentar novamente</Link>
          </Button>
          <Button asChild variant="brand-outline" size="xl">
            <Link to="/cart">Ver carrinho</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (order.status === 'pending') {
    return (
      <p className="px-6 py-6 text-center text-body text-text-secondary">
        Estamos aguardando a confirmação na {network}. Você pode recarregar ou sair desta página: o pedido não será
        criado de novo.
      </p>
    )
  }

  return (
    <div className="flex flex-col items-center gap-5 px-6 py-6 text-center sm:px-14">
      <p className="text-body text-text-secondary">
        Transação confirmada na {network}. A propriedade foi transferida para sua carteira conectada e registrada na
        rede.
      </p>
      {order.explorerUrl && (
        <Button asChild variant="brand" size="xl" className="h-12 px-4 text-body-lg">
          <a href={order.explorerUrl} target="_blank" rel="noopener noreferrer">
            Ver no {EXPLORER_NAMES[order.network]}
            <ExternalLink className="size-4" aria-hidden="true" />
            <span className="sr-only">(abre em nova aba, link simulado)</span>
          </a>
        </Button>
      )}
    </div>
  )
}
