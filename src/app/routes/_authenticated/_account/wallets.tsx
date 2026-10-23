import { createFileRoute } from '@tanstack/react-router'
import { walletQueries } from '@/entities/wallet'
import { WalletsPage } from '@/pages/wallets'
import { viewer } from '@/shared/api'

export const Route = createFileRoute('/_authenticated/_account/wallets')({
  loader: ({ context }) => {
    void context.queryClient.prefetchQuery(walletQueries.list(viewer.getId()))
  },
  component: WalletsPage,
})
