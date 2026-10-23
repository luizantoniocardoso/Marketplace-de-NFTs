import { useRouter } from '@tanstack/react-router'
import { MarketBreadcrumbs, MobileTopBar } from '@/shared/ui'
import { CartItems } from '@/widgets/cart-items'
import { CartSummary } from '@/widgets/cart-summary'
import { RelatedNfts } from '@/widgets/related-nfts'

export function CartPage() {
  const router = useRouter()
  const goBack = () => (router.history.canGoBack() ? router.history.back() : void router.navigate({ to: '/' }))

  return (
    <>
      <div className="page-container pt-6 md:pt-8">
        <MarketBreadcrumbs trail={['Carrinho']} className="hidden md:block" />
        <MobileTopBar title="Carrinho de NFTs" onBack={goBack} />
        <h1 className="sr-only max-md:hidden">Carrinho de NFTs</h1>
        <div className="mt-5 md:mt-3 lg:grid lg:grid-cols-[minmax(0,782px)_332px] lg:justify-between lg:gap-10">
          <CartItems />
          <div className="md:mt-10 lg:mt-0 lg:pt-0">
            <CartSummary />
          </div>
        </div>
      </div>
      <RelatedNfts
        title="Colecionadores também viram"
        params={{ tab: 'trending', sort: 'recent' }}
        className="mt-[100px] hidden md:block"
      />
    </>
  )
}
