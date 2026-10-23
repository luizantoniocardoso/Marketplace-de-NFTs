import { AlertTriangle } from 'lucide-react'
import { QuoteSummary } from '@/entities/cart'
import { getApiError } from '@/shared/api'
import { NFT_NETWORK_LABELS, WALLET_PROVIDER_LABELS } from '@/shared/contracts'
import { shortenAddress } from '@/shared/lib'
import { Button, Dialog, DialogContent, DialogDescription, DialogTitle } from '@/shared/ui'
import type { CheckoutController } from '../model'
import { OrderItemsReview } from './OrderItemsReview'

function placeErrorMessage(error: unknown) {
  const apiError = getApiError(error)
  if (apiError.timedOut) {
    return 'Não recebemos a confirmação a tempo. Tente novamente: o mesmo pedido será recuperado, sem cobrança duplicada.'
  }
  return apiError.message
}

export function ReviewOrderDialog({ checkout }: { checkout: CheckoutController }) {
  const { quote, cart, reviewedFingerprint, selectedWallet, provider, network, placing, placeError } = checkout
  const changed = Boolean(quote.data && reviewedFingerprint && quote.data.fingerprint !== reviewedFingerprint)
  const blocked = Boolean(quote.data && !quote.data.purchasable)

  return (
    <Dialog open={checkout.reviewOpen} onOpenChange={(open) => !open && !placing && checkout.closeReview()}>
      <DialogContent className="block max-h-[calc(100dvh-2rem)] w-full max-w-[560px] overflow-y-auto rounded-none bg-surface-card p-6 sm:max-w-[560px]">
        <DialogTitle className="text-title font-bold text-foreground">Revise sua compra</DialogTitle>
        <DialogDescription className="mt-1 text-body text-text-secondary">
          Confira itens, carteira e valores antes de confirmar.
        </DialogDescription>

        <OrderItemsReview items={cart.data?.items} className="mt-5" />

        {selectedWallet && provider && network && (
          <p className="mt-4 text-body text-foreground">
            Pagamento com <strong>{WALLET_PROVIDER_LABELS[provider]}</strong> na rede{' '}
            <strong>{NFT_NETWORK_LABELS[network]}</strong> · {shortenAddress(selectedWallet.address)}
          </p>
        )}

        <QuoteSummary className="mt-5" quote={quote.data} loading={quote.isPending} />

        {(changed || blocked) && (
          <div role="alert" className="mt-5 flex gap-2 rounded-[4px] border border-amber/60 bg-amber/10 p-3 text-body text-foreground">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber" aria-hidden="true" />
            <div>
              {blocked
                ? quote.data?.issues[0] ?? 'Há itens indisponíveis. Ajuste o carrinho para continuar.'
                : 'Os valores mudaram desde a sua revisão. Confira o novo resumo e confirme novamente.'}
            </div>
          </div>
        )}

        {placeError && !changed && (
          <p role="alert" className="mt-4 text-body text-coral">
            {placeErrorMessage(placeError)}
          </p>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="brand-outline" size="xl" onClick={checkout.closeReview} disabled={placing}>
            Voltar
          </Button>
          {changed ? (
            <Button variant="brand" size="xl" onClick={checkout.acceptNewQuote} disabled={blocked}>
              Aceitar novos valores
            </Button>
          ) : (
            <Button
              variant="brand"
              size="xl"
              onClick={checkout.confirmOrder}
              disabled={placing || blocked || quote.isFetching || !quote.data}
            >
              {placing ? 'Enviando pedido…' : placeError ? 'Tentar novamente' : 'Confirmar compra'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
