import { Link, useNavigate } from '@tanstack/react-router'
import { QuoteIssues, QuoteSummary, useCart, useCartQuote } from '@/entities/cart'
import { CouponForm } from '@/features/apply-coupon'
import { Button } from '@/shared/ui'

export function CartSummary() {
  const navigate = useNavigate()
  const cart = useCart()
  const hasItems = Boolean(cart.data?.items.length)
  const quote = useCartQuote({ enabled: hasItems })
  const loading = cart.isPending || (hasItems && quote.isPending)
  const canCheckout = hasItems && Boolean(quote.data?.purchasable) && !quote.isFetching

  return (
    <>
      <section aria-labelledby="cart-summary-title" className="hidden md:block">
        <h2 id="cart-summary-title" className="border-b border-border pb-2.5 text-body-lg font-bold text-foreground">
          Resumo da carteira
        </h2>
        <CouponForm className="mt-6" coupon={cart.data?.coupon ?? null} disabled={!hasItems} />
        <QuoteSummary className="mt-6" quote={quote.data} loading={loading} />
        <QuoteIssues className="mt-3" quote={quote.data} />
        <Button
          variant="brand"
          size="md"
          className="mt-6 w-full text-body-md"
          disabled={!canCheckout}
          onClick={() => void navigate({ to: '/checkout' })}
        >
          Conectar e finalizar
        </Button>
        <Link to="/" className="mt-4 block text-center text-body-md text-text-accent hover:text-brand-light">
          Continuar explorando
        </Link>
      </section>

      {hasItems && (
        <section aria-label="Resumo do pedido" className="-mx-6 mt-6 rounded-t-[32px] bg-ink px-6 pt-6 pb-8 md:hidden">
          <CouponForm variant="pill" coupon={cart.data?.coupon ?? null} />
          <QuoteSummary className="mt-5" quote={quote.data} loading={loading} />
          <QuoteIssues className="mt-3" quote={quote.data} />
          <Button
            variant="brand-pill"
            size="pill"
            className="mt-8 w-full"
            disabled={!canCheckout}
            onClick={() => void navigate({ to: '/checkout' })}
          >
            Conectar e finalizar
          </Button>
        </section>
      )}
    </>
  )
}
