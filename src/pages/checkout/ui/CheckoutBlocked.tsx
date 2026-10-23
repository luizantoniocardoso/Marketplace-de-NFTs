import { Link } from '@tanstack/react-router'
import { AlertTriangle, ShoppingCart, Wallet } from 'lucide-react'
import { Button, StateMessage } from '@/shared/ui'

type BlockedReason = 'empty-cart' | 'no-wallet' | 'error'

export function CheckoutBlocked({ reason, onRetry }: { reason: BlockedReason; onRetry?: () => void }) {
  if (reason === 'error') {
    return (
      <StateMessage
        role="alert"
        icon={AlertTriangle}
        iconClassName="text-coral"
        title="Não foi possível preparar o pagamento"
        description="Verifique sua conexão e tente novamente. Seus itens continuam no carrinho."
        action={
          <Button variant="brand" size="md" onClick={onRetry}>
            Tentar novamente
          </Button>
        }
      />
    )
  }

  if (reason === 'no-wallet') {
    return (
      <StateMessage
        icon={Wallet}
        title="Cadastre uma carteira para pagar"
        description="As carteiras cadastradas ficam disponíveis no pagamento e recebem os NFTs comprados."
        action={
          <Button asChild variant="brand" size="md">
            <Link to="/wallets">Cadastrar carteira</Link>
          </Button>
        }
      />
    )
  }

  return (
    <StateMessage
      icon={ShoppingCart}
      title="Seu carrinho está vazio"
      description="Adicione NFTs ao carrinho para finalizar uma compra."
      action={
        <Button asChild variant="brand" size="md">
          <Link to="/">Explorar NFTs</Link>
        </Button>
      }
    />
  )
}
