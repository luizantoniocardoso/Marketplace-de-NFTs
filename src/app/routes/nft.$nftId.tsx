import { createFileRoute } from '@tanstack/react-router'
import { NftDetailsPage } from '@/pages/nft-details'

export const Route = createFileRoute('/nft/$nftId')({
  component: NftDetailsPage,
})
