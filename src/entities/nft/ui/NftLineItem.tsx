import type { ReactNode } from 'react'
import type { NftImageDto } from '@/shared/contracts'
import { cn } from '@/shared/lib'

interface NftLineItemProps {
  image: NftImageDto
  name: ReactNode
  subtitle: ReactNode
  size?: 'sm' | 'md'
  className?: string
}

export function NftLineItem({ image, name, subtitle, size = 'md', className }: NftLineItemProps) {
  return (
    <div className={cn('flex min-w-0 items-center gap-3 md:gap-4', className)}>
      <img
        src={image.small}
        width={70}
        height={70}
        alt={image.alt}
        loading="lazy"
        decoding="async"
        className={cn('shrink-0 rounded-sm object-cover', size === 'md' ? 'size-[70px]' : 'size-[66px]')}
      />
      <div className="min-w-0">
        <p className="truncate text-body-md font-bold text-foreground">{name}</p>
        <p className="truncate text-body text-text-secondary">{subtitle}</p>
      </div>
    </div>
  )
}
