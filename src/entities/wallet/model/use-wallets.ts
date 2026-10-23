import { useQuery } from '@tanstack/react-query'
import { useViewerId } from '@/shared/api'
import { walletQueries } from '../api'

export function useWallets() {
  return useQuery(walletQueries.list(useViewerId()))
}

export function useWalletConnection() {
  return useQuery(walletQueries.connection(useViewerId()))
}
