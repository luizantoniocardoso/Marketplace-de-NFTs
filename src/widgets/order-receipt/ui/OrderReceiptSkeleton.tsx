import { Skeleton } from '@/shared/ui'

export function OrderReceiptSkeleton() {
  return (
    <div aria-busy="true" className="mx-auto w-full max-w-[578px] bg-surface-card p-6">
      <p role="status" className="sr-only">
        Carregando pedido
      </p>
      <div aria-hidden="true" className="flex flex-col items-center gap-4">
        <Skeleton className="size-16 rounded-full" />
        <Skeleton className="h-5 w-64" />
        <Skeleton className="mt-4 h-12 w-full" />
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-[70px] w-full" />
        ))}
        <Skeleton className="h-12 w-40" />
      </div>
    </div>
  )
}
