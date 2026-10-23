import { getRouteApi, Link } from '@tanstack/react-router'
import { AlertTriangle, SearchX } from 'lucide-react'
import { useOrder } from '@/entities/order'
import { getApiError } from '@/shared/api'
import { Button, StateMessage } from '@/shared/ui'
import { OrderReceipt, OrderReceiptSkeleton } from '@/widgets/order-receipt'

const route = getRouteApi('/_authenticated/orders/$orderId')

export function OrderConfirmationPage() {
  const { orderId } = route.useParams()
  const { data: order, error, isPending, refetch } = useOrder(orderId)

  const content = () => {
    if (order) return <OrderReceipt order={order} />
    if (isPending) return <OrderReceiptSkeleton />
    if (getApiError(error).code === 'NOT_FOUND') {
      return (
        <StateMessage
          icon={SearchX}
          title={<h1>Pedido não encontrado</h1>}
          description="Não encontramos este pedido na sua conta."
          action={
            <Button asChild variant="brand" size="md">
              <Link to="/">Voltar ao início</Link>
            </Button>
          }
        />
      )
    }
    return (
      <StateMessage
        role="alert"
        icon={AlertTriangle}
        iconClassName="text-coral"
        title={<h1>Não foi possível carregar o pedido</h1>}
        description={`${getApiError(error).message} O pedido não será criado novamente.`}
        action={
          <Button variant="brand" size="md" onClick={() => refetch()}>
            Tentar novamente
          </Button>
        }
      />
    )
  }

  return <div className="page-container pt-10 pb-16 md:pt-[98px]">{content()}</div>
}
