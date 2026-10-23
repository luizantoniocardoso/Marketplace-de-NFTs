import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { saveWallet, walletKeys } from '@/entities/wallet'
import { useViewerId } from '@/shared/api'
import { WALLET_SLOT_LABELS, type UpsertWalletRequest, type WalletSlot } from '@/shared/contracts'

export function useSaveWallet() {
  const queryClient = useQueryClient()
  const viewerId = useViewerId()

  return useMutation({
    mutationFn: ({ slot, body }: { slot: WalletSlot; body: UpsertWalletRequest }) => saveWallet(slot, body),
    onSuccess: (wallet) => {
      toast.success(`Carteira ${WALLET_SLOT_LABELS[wallet.slot].toLowerCase()} salva.`)
      return queryClient.invalidateQueries({ queryKey: walletKeys.list(viewerId) })
    },
  })
}
