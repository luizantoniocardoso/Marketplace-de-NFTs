import { Skeleton } from '@/shared/ui'

export function NftCardSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="bg-surface-card p-1.5 max-md:rounded-2xl md:flex md:aspect-[259/299] md:items-center md:px-[5px] md:py-0">
        <Skeleton className="aspect-square w-full rounded-xl bg-surface-raised" />
      </div>
      <Skeleton className="mt-3 h-[22px] w-3/4 md:mt-[19px]" />
      <Skeleton className="mt-1 h-6 w-1/3" />
    </div>
  )
}
