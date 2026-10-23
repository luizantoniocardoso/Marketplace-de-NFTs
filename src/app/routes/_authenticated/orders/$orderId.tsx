import { createFileRoute } from '@tanstack/react-router'
import { orderQueries } from '@/entities/order'
import { OrderConfirmationPage } from '@/pages/order-confirmation'
import { viewer } from '@/shared/api'

export const Route = createFileRoute('/_authenticated/orders/$orderId')({
  loader: ({ context, params }) => {
    void context.queryClient.prefetchQuery(orderQueries.detail(viewer.getId(), params.orderId))
  },
  component: OrderConfirmationPage,
})
