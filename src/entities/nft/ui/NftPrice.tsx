import type { NftSummaryDto } from '@/shared/contracts'
import { cn, formatEth } from '@/shared/lib'

interface NftPriceProps {
  nft: Pick<NftSummaryDto, 'priceEth' | 'previousPriceEth' | 'available'>
  className?: string
}

export function NftPrice({ nft, className }: NftPriceProps) {
  if (nft.available === 0) {
    return <p className={cn('font-bold text-text-secondary', className)}>Esgotado</p>
  }

  return (
    <p className={cn('font-bold text-text-accent', className)}>
      <span className="sr-only">Preço: </span>
      {formatEth(nft.priceEth)}
      {nft.previousPriceEth && (
        <span className="ml-2 font-normal text-text-secondary">
          <span className="sr-only">, antes </span>
          <s className="no-underline">{formatEth(nft.previousPriceEth)}</s>
        </span>
      )}
    </p>
  )
}
