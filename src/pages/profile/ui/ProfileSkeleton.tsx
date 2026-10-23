import { Skeleton } from '@/shared/ui'

export function ProfileSkeleton() {
  return (
    <div aria-hidden="true" className="grid gap-x-7 gap-y-6 lg:grid-cols-2">
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="flex flex-col gap-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  )
}
