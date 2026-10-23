import { useQuery } from '@tanstack/react-query'
import { useId } from 'react'
import { NftCard, NftCardSkeleton, nftQueries } from '@/entities/nft'
import type { NftListParams } from '@/shared/contracts'
import { cn } from '@/shared/lib'
import { ScrollCarousel } from '@/shared/ui'

const RELATED_PAGE_SIZE = 15
const SKELETON_COUNT = 5
const MIN_ITEMS = 5
const MAX_ITEMS = 10

interface RelatedNftsProps {
  title: string
  params: Omit<NftListParams, 'pageSize' | 'page'>
  excludeId?: string
  className?: string
}

const itemClass = 'w-[calc((100%-16px)/2.2)] shrink-0 snap-start md:w-[calc((100%-75px)/4)] lg:w-[calc((100%-100px)/5)]'

export function RelatedNfts({ title, params, excludeId, className }: RelatedNftsProps) {
  const titleId = useId()
  const { data, isPending, isError } = useQuery(nftQueries.list({ ...params, pageSize: RELATED_PAGE_SIZE, page: 1 }))
  const primary = data?.items.filter((nft) => nft.id !== excludeId) ?? []
  const needsFallback = Boolean(data) && primary.length < MIN_ITEMS
  const fallback = useQuery({
    ...nftQueries.list({ sort: 'recent', tab: 'all', pageSize: RELATED_PAGE_SIZE, page: 1 }),
    enabled: needsFallback,
  })
  const seen = new Set(primary.map((nft) => nft.id))
  const extra = (fallback.data?.items ?? []).filter((nft) => nft.id !== excludeId && !seen.has(nft.id))
  const items = [...primary, ...(needsFallback ? extra : [])].slice(0, MAX_ITEMS)

  if (isError || (data && !items.length)) return null

  return (
    <section aria-labelledby={titleId} className={cn('page-container', className)}>
      <h2 id={titleId} className="border-b border-border pb-2 text-body-lg font-bold text-text-accent">
        {title}
      </h2>
      <ScrollCarousel label={title} className="mt-7">
        {isPending
          ? Array.from({ length: SKELETON_COUNT }, (_, index) => (
              <li key={index} className={itemClass}>
                <NftCardSkeleton />
              </li>
            ))
          : items.map((nft) => (
              <li key={nft.id} className={itemClass}>
                <NftCard nft={nft} />
              </li>
            ))}
      </ScrollCarousel>
    </section>
  )
}
