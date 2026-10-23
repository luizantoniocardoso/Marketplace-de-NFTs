import type { NftDetailDto } from '@/shared/contracts'
import { usePurchase } from '../model'
import { NftPurchaseMobile } from './NftPurchaseMobile'
import { NftPurchasePanel } from './NftPurchasePanel'

export function NftPurchase({ nft, shareUrl }: { nft: NftDetailDto; shareUrl: string }) {
  const purchase = usePurchase(nft)

  return (
    <>
      <NftPurchasePanel nft={nft} purchase={purchase} shareUrl={shareUrl} />
      <NftPurchaseMobile nft={nft} purchase={purchase} />
    </>
  )
}
