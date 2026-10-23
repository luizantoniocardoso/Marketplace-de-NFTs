import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { connectWallet, disconnectWallet, walletKeys } from '@/entities/wallet'
import { getApiError, useViewerId } from '@/shared/api'
import { WALLET_PROVIDER_LABELS } from '@/shared/contracts'

export function useConnectWallet() {
  const queryClient = useQueryClient()
  const viewerId = useViewerId()

  return useMutation({
    mutationFn: connectWallet,
    onSuccess: (connection) => {
      queryClient.setQueryData(walletKeys.connection(viewerId), connection)
      toast.success(`${WALLET_PROVIDER_LABELS[connection.provider]} conectada.`)
    },
    onError: (error) => toast.error(getApiError(error).message),
  })
}

export function useDisconnectWallet() {
  const queryClient = useQueryClient()
  const viewerId = useViewerId()

  return useMutation({
    mutationFn: disconnectWallet,
    onSuccess: () => {
      queryClient.setQueryData(walletKeys.connection(viewerId), null)
      toast.success('Carteira desconectada.')
    },
    onError: (error) => toast.error(getApiError(error).message),
  })
}
