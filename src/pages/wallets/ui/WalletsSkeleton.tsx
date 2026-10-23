import { Skeleton } from '@/shared/ui'

export function WalletsSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-6">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-full max-w-lg" />
      <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">
        {Array.from({ length: 10 }, (_, index) => (
          <div key={index} className="flex flex-col gap-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    </div>
  )
}
