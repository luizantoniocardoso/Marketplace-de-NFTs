import { createFileRoute } from '@tanstack/react-router'
import { cartQueries } from '@/entities/cart'
import { walletQueries } from '@/entities/wallet'
import { CheckoutPage } from '@/pages/checkout'
import { viewer } from '@/shared/api'

export const Route = createFileRoute('/_authenticated/checkout')({
  staticData: { immersiveMobile: true },
  loader: ({ context }) => {
    const viewerId = viewer.getId()
    void context.queryClient.prefetchQuery(cartQueries.detail(viewerId))
    void context.queryClient.prefetchQuery(walletQueries.list(viewerId))
  },
  component: CheckoutPage,
})
