import { queryOptions } from '@tanstack/react-query'
import { privateKey } from '@/shared/api'
import { fetchWalletConnection, fetchWallets } from './wallet-api'

export const walletKeys = {
  list: (viewerId: string | null) => privateKey(viewerId, 'wallets'),
  connection: (viewerId: string | null) => privateKey(viewerId, 'wallet-connection'),
}

export const walletQueries = {
  list: (viewerId: string | null) =>
    queryOptions({
      queryKey: walletKeys.list(viewerId),
      queryFn: ({ signal }) => fetchWallets(signal),
      enabled: Boolean(viewerId),
    }),
  connection: (viewerId: string | null) =>
    queryOptions({
      queryKey: walletKeys.connection(viewerId),
      queryFn: ({ signal }) => fetchWalletConnection(signal),
      enabled: Boolean(viewerId),
    }),
}
