import type { NftDetailDto } from '@/shared/contracts'
import { cn } from '@/shared/lib'

export function NftMetaList({ nft, className }: { nft: NftDetailDto; className?: string }) {
  const items = [
    { term: 'ID do token', value: nft.tokenId },
    { term: 'Coleção', value: nft.collectionName },
    { term: 'Atributos', value: nft.attributes.join(', ') },
  ]

  return (
    <dl className={cn('flex flex-col gap-3 text-body text-text-secondary md:gap-2.5', className)}>
      {items.map((item) => (
        <div key={item.term} className="flex gap-1.5">
          <dt>{item.term}:</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
