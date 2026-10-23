import { Skeleton } from '@/shared/ui'

export function CheckoutSkeleton() {
  return (
    <div
      aria-busy="true"
      className="flex flex-col gap-10 lg:grid lg:grid-cols-[minmax(0,763px)_405px] lg:justify-between"
    >
      <p role="status" className="sr-only">
        Preparando o pagamento
      </p>
      <div aria-hidden="true" className="grid gap-x-6 gap-y-5 md:grid-cols-2">
        {Array.from({ length: 10 }, (_, index) => (
          <div key={index} className="flex flex-col gap-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
      <div aria-hidden="true" className="flex flex-col gap-3">
        <Skeleton className="h-6 w-28" />
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-[70px] w-full" />
        ))}
        <Skeleton className="mt-4 h-24 w-full" />
        <Skeleton className="mt-4 h-[45px] w-full" />
      </div>
    </div>
  )
}
