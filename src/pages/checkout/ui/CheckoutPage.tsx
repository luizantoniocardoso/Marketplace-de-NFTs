import { useRouter } from '@tanstack/react-router'
import { useCart } from '@/entities/cart'
import { useProfile } from '@/entities/user'
import { useWallets } from '@/entities/wallet'
import { MarketBreadcrumbs, MobileTopBar } from '@/shared/ui'
import { CheckoutView } from '@/widgets/checkout'
import { CheckoutBlocked } from './CheckoutBlocked'
import { CheckoutSkeleton } from './CheckoutSkeleton'

export function CheckoutPage() {
  const router = useRouter()
  const cart = useCart()
  const wallets = useWallets()
  const profile = useProfile()
  const goBack = () => (router.history.canGoBack() ? router.history.back() : void router.navigate({ to: '/cart' }))

  const content = () => {
    if (cart.isPending || wallets.isPending || profile.isPending) return <CheckoutSkeleton />
    if (cart.isError || wallets.isError || profile.isError) {
      return (
        <CheckoutBlocked
          reason="error"
          onRetry={() => void Promise.all([cart.refetch(), wallets.refetch(), profile.refetch()])}
        />
      )
    }
    if (!cart.data.items.length) return <CheckoutBlocked reason="empty-cart" />
    if (!wallets.data.length) return <CheckoutBlocked reason="no-wallet" />
    return <CheckoutView wallets={wallets.data} profile={profile.data} />
  }

  return (
    <div className="page-container pt-6 md:pt-8">
      <MarketBreadcrumbs trail={['Pagamento']} className="hidden md:block" />
      <MobileTopBar title="Pagamento com carteira" onBack={goBack} />
      <h1 className="sr-only max-md:hidden">Pagamento</h1>
      <div className="mt-6 md:mt-8">{content()}</div>
    </div>
  )
}
