import { createFileRoute } from '@tanstack/react-router'
import { nftQueries } from '@/entities/nft'
import { NftDetailsPage } from '@/pages/nft-details'

export const Route = createFileRoute('/nft/$nftId')({
  staticData: { immersiveMobile: true },
  loader: ({ context, params }) => {
    void context.queryClient.prefetchQuery(nftQueries.detail(params.nftId))
  },
  component: NftDetailsPage,
})
