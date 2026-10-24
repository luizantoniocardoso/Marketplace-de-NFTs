import { Link } from '@tanstack/react-router'
import { QuoteIssues, QuoteSummary } from '@/entities/cart'
import { Button } from '@/shared/ui'
import type { CheckoutController } from '../model'
import { ConnectionStatus } from './ConnectionStatus'
import { OrderItemsReview } from './OrderItemsReview'
import { ProviderOptions } from './ProviderOptions'

export function CheckoutSidePanel({ checkout }: { checkout: CheckoutController }) {
  const { quote, cart, form } = checkout

  return (
    <div className="flex flex-col">
      <OrderItemsReview items={cart.data?.items} />
      <p className="mt-4 text-center text-body text-foreground">
        Tem um código promocional?{' '}
        <Link to="/cart" className="hover:text-text-accent">
          Aplique aqui
        </Link>
      </p>
      <QuoteSummary className="mt-2" quote={quote.data} loading={quote.isPending} />
      <QuoteIssues className="mt-3" quote={quote.data} />

      <h2 className="mt-4 text-center text-body-lg font-bold text-foreground">Carteira e rede</h2>
      <div className="mt-5">
        <ProviderOptions
          variant="panel"
          value={checkout.provider}
          onChange={checkout.selectProvider}
          error={form.formState.errors.provider?.message}
        />
      </div>
      <ConnectionStatus checkout={checkout} className="mt-3" />

      <Button
        variant="brand"
        size="xl"
        className="mt-6 w-full"
        onClick={() => !checkout.connecting && void checkout.startReview()}
        aria-disabled={checkout.connecting || undefined}
        disabled={!cart.data?.items.length}
      >
        {checkout.connecting ? 'Conectando carteira…' : 'Confirmar compra'}
      </Button>
    </div>
  )
}
