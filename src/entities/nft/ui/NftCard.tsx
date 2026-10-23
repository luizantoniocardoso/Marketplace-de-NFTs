import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import type { NftSummaryDto } from '@/shared/contracts'
import { cn } from '@/shared/lib'
import { NftCardMedia } from './NftCardMedia'
import { NftPrice } from './NftPrice'

interface NftCardProps {
  nft: NftSummaryDto
  action?: ReactNode
  priority?: boolean
  className?: string
}

export function NftCard({ nft, action, priority = false, className }: NftCardProps) {
  return (
    <article className={cn('group relative', className)}>
      <NftCardMedia nft={nft} action={action} priority={priority} />
      <h3 className="mt-3 text-body md:mt-[19px] md:text-body-md">
        <Link
          to="/nft/$nftId"
          params={{ nftId: nft.id }}
          className="outline-none after:absolute after:inset-0 after:content-[''] focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-ring"
        >
          {nft.name}
        </Link>
      </h3>
      <NftPrice nft={nft} className="mt-0.5 text-body-md md:text-body-lg" />
    </article>
  )
}
