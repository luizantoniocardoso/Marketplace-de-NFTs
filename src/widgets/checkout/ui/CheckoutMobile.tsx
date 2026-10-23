import { Link } from '@tanstack/react-router'
import { formatEth } from '@/shared/lib'
import { Button } from '@/shared/ui'
import type { CheckoutController } from '../model'
import { ConnectionStatus } from './ConnectionStatus'
import { ProviderOptions } from './ProviderOptions'
import { WalletOptions } from './WalletOptions'

export function CheckoutMobilePayment({ checkout }: { checkout: CheckoutController }) {
  const { quote } = checkout

  return (
    <div className="flex flex-col md:hidden">
      <div className="flex items-center justify-between">
        <h2 className="text-body-lg font-bold text-foreground">Carteira conectada</h2>
        <Link to="/wallets" className="text-body font-bold text-text-accent">
          Trocar carteira
        </Link>
      </div>
      <div className="mt-4">
        <WalletOptions wallets={checkout.wallets} selectedId={checkout.selectedWallet?.id ?? null} onSelect={checkout.selectWallet} />
      </div>

      <h2 className="mt-6 text-body-lg font-bold text-foreground">Carteira e rede</h2>
      <div className="mt-3">
        <ProviderOptions
          variant="card"
          value={checkout.provider}
          onChange={checkout.selectProvider}
          error={checkout.form.formState.errors.provider?.message}
        />
      </div>
      <ConnectionStatus checkout={checkout} className="mt-3" />

      <p className="mt-5 flex items-center justify-end gap-6 text-title font-bold">
        <span className="text-foreground">Total:</span>
        <span className="text-text-accent">{quote.data ? formatEth(quote.data.totalEth) : '—'}</span>
      </p>

    </div>
  )
}

export function CheckoutMobileConfirm({ checkout }: { checkout: CheckoutController }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 bg-gradient-to-t from-ink via-ink to-transparent px-7 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:hidden">
      <Button
        variant="brand-pill"
        size="pill"
        className="w-full"
        onClick={() => void checkout.startReview()}
        disabled={checkout.connecting || !checkout.cart.data?.items.length}
      >
        {checkout.connecting ? 'Conectando carteira…' : 'Confirmar compra'}
      </Button>
    </div>
  )
}
