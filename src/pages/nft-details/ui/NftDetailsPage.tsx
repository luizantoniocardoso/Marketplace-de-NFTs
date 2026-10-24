import { useQuery } from '@tanstack/react-query'
import { getRouteApi, useRouter } from '@tanstack/react-router'
import { nftQueries } from '@/entities/nft'
import { FavoriteButton } from '@/features/toggle-favorite'
import { useDocumentTitle } from '@/shared/lib'
import { MarketBreadcrumbs, MobileTopBar } from '@/shared/ui'
import { NftGallery } from '@/widgets/nft-gallery'
import { NftInfoTabs } from '@/widgets/nft-info-tabs'
import { NftPurchase } from '@/widgets/nft-purchase'
import { RelatedNfts } from '@/widgets/related-nfts'
import { NftDetailsError } from './NftDetailsError'
import { NftDetailsSkeleton } from './NftDetailsSkeleton'

const route = getRouteApi('/nft/$nftId')

export function NftDetailsPage() {
  const { nftId } = route.useParams()
  const router = useRouter()
  const { data: nft, error, isPending, refetch } = useQuery(nftQueries.detail(nftId))
  useDocumentTitle(nft?.name ?? (error ? 'NFT não encontrado' : null))

  const goBack = () => (router.history.canGoBack() ? router.history.back() : void router.navigate({ to: '/' }))

  if (isPending) return <NftDetailsSkeleton onBack={goBack} />
  if (!nft) return <NftDetailsError error={error} onRetry={() => refetch()} onBack={goBack} />

  return (
    <article aria-labelledby="nft-title" className="max-md:min-h-dvh max-md:bg-surface-card">
      <div className="md:page-container md:pt-8">
        <MarketBreadcrumbs className="hidden md:block" />
        <MobileTopBar
          className="px-7 pt-6 pb-1.5"
          onBack={goBack}
          action={<FavoriteButton nftId={nft.id} nftName={nft.name} variant="icon" />}
        />
        <span id="nft-title" className="sr-only">
          {nft.name}
        </span>
        <div className="md:mt-3 lg:grid lg:grid-cols-[572px_minmax(0,1fr)] lg:gap-8">
          <NftGallery images={nft.gallery} name={nft.name} className="max-md:px-7" />
          <div className="md:mt-8 lg:mt-0">
            <NftPurchase nft={nft} shareUrl={typeof window === 'undefined' ? '' : window.location.href} />
          </div>
        </div>
        <NftInfoTabs nft={nft} className="px-6 pb-[220px] md:mt-[78px] md:px-0 md:pb-0" />
      </div>
      <RelatedNfts
        title="Mais desta coleção"
        params={{ collections: [nft.collection], sort: 'recent', tab: 'all' }}
        excludeId={nft.id}
        className="mt-[88px] hidden md:block"
      />
    </article>
  )
}
