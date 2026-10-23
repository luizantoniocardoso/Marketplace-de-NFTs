import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { cartKeys, useCart, useCartQuote } from '@/entities/cart'
import { useWalletConnection } from '@/entities/wallet'
import { useConnectWallet, useDisconnectWallet } from '@/features/connect-wallet'
import { clearOrderAttempts, usePlaceOrder } from '@/features/place-order'
import { getApiError, useViewerId } from '@/shared/api'
import type { NftNetwork, UserDto, WalletDto, WalletProvider } from '@/shared/contracts'
import { standardResolver } from '@/shared/lib'
import { clearCheckoutDraft, readCheckoutDraft, writeCheckoutDraft } from './checkout-draft'
import { checkoutDefaults, checkoutSchema, toCollector, type CheckoutValues } from './checkout-schema'

export function useCheckout(wallets: WalletDto[], profile: UserDto) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const viewerId = useViewerId()
  const cart = useCart()
  const quote = useCartQuote({ enabled: Boolean(cart.data?.items.length) })
  const connection = useWalletConnection()
  const connect = useConnectWallet()
  const disconnect = useDisconnectWallet()
  const placeOrder = usePlaceOrder({
    onPlaced: (order) => {
      clearCheckoutDraft(viewerId)
      clearOrderAttempts()
      void navigate({ to: '/orders/$orderId', params: { orderId: order.id }, replace: true })
    },
  })

  const [draft] = useState(() => readCheckoutDraft(viewerId))
  const [walletId, setWalletId] = useState<string | null>(draft?.walletId ?? null)
  const [note, setNote] = useState(draft?.note ?? '')
  const [reviewOpen, setReviewOpen] = useState(false)
  const [reviewedFingerprint, setReviewedFingerprint] = useState<string | null>(null)

  const selectedWallet: WalletDto | null =
    wallets.find((wallet) => wallet.id === walletId) ?? wallets.find((wallet) => wallet.slot === 'primary') ?? wallets[0] ?? null

  const form = useForm<CheckoutValues>({
    resolver: standardResolver(checkoutSchema),
    defaultValues: draft?.values ?? checkoutDefaults(selectedWallet, profile),
  })

  const values = useWatch({ control: form.control })
  useEffect(() => {
    writeCheckoutDraft(viewerId, { walletId: selectedWallet?.id ?? null, values: values as CheckoutValues, note })
  }, [values, viewerId, selectedWallet?.id, note])

  const provider = (values.provider ?? '') as WalletProvider | ''
  const network = (values.network ?? '') as NftNetwork | ''
  const connectionData = connection.data ?? null
  const connected = Boolean(
    connectionData &&
      selectedWallet &&
      connectionData.walletId === selectedWallet.id &&
      connectionData.provider === provider &&
      connectionData.network === network,
  )

  const selectWallet = (wallet: WalletDto) => {
    setWalletId(wallet.id)
    form.reset(checkoutDefaults(wallet, profile))
  }

  const selectProvider = (value: WalletProvider) => form.setValue('provider', value, { shouldValidate: true, shouldDirty: true })

  const connectSelected = async () => {
    if (!selectedWallet || !provider || !network) return false
    try {
      await connect.mutateAsync({ walletId: selectedWallet.id, provider, network })
      return true
    } catch {
      return false
    }
  }

  const startReview = form.handleSubmit(async () => {
    if (!selectedWallet) return
    if (!connected && !(await connectSelected())) return
    const fresh = await quote.refetch()
    setReviewedFingerprint(fresh.data?.fingerprint ?? null)
    placeOrder.reset()
    setReviewOpen(true)
  })

  const confirmOrder = () => {
    const values = form.getValues()
    if (!selectedWallet || !reviewedFingerprint) return
    placeOrder.mutate(
      {
        quoteFingerprint: reviewedFingerprint,
        walletId: selectedWallet.id,
        provider: values.provider as WalletProvider,
        network: values.network as NftNetwork,
        collector: toCollector(values),
        note: note.trim() || null,
      },
      {
        onSuccess: () => setReviewOpen(false),
        onError: (error) => {
          if (getApiError(error).code === 'QUOTE_OUTDATED') {
            void queryClient.invalidateQueries({ queryKey: cartKeys.quote(viewerId) })
          }
        },
      },
    )
  }

  return {
    form,
    cart,
    quote,
    wallets,
    selectedWallet,
    selectWallet,
    provider,
    network,
    selectProvider,
    connection: connectionData,
    connected,
    connecting: connect.isPending,
    connectSelected,
    disconnect: () => disconnect.mutate(),
    disconnecting: disconnect.isPending,
    note,
    setNote,
    startReview,
    reviewOpen,
    closeReview: () => setReviewOpen(false),
    reviewedFingerprint,
    acceptNewQuote: () => {
      placeOrder.reset()
      setReviewedFingerprint(quote.data?.fingerprint ?? null)
    },
    confirmOrder,
    placing: placeOrder.isPending,
    placeError: placeOrder.error,
  }
}

export type CheckoutController = ReturnType<typeof useCheckout>
