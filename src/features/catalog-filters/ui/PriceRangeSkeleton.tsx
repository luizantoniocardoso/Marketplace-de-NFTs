import { Skeleton } from '@/shared/ui'

export function PriceRangeSkeleton() {
  return (
    <div className="mt-4 space-y-3 px-2.5">
      <Skeleton className="h-2 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-9 w-24" />
    </div>
  )
}
