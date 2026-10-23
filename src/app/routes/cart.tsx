import { createFileRoute } from '@tanstack/react-router'
import { cartQueries } from '@/entities/cart'
import { CartPage } from '@/pages/cart'
import { viewer } from '@/shared/api'

export const Route = createFileRoute('/cart')({
  staticData: { immersiveMobile: true },
  loader: ({ context }) => {
    void context.queryClient.prefetchQuery(cartQueries.detail(viewer.getId()))
  },
  component: CartPage,
})
