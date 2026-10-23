import { MobileTopBar, Skeleton } from '@/shared/ui'

export function NftDetailsSkeleton({ onBack }: { onBack: () => void }) {
  return (
    <div aria-busy="true" className="max-md:min-h-dvh max-md:bg-surface-card">
      <p role="status" className="sr-only">
        Carregando NFT
      </p>
      <MobileTopBar className="px-7 pt-6 pb-1.5" onBack={onBack} />
      <div aria-hidden="true" className="md:page-container md:pt-8">
        <Skeleton className="hidden h-5 w-40 md:block" />
        <div className="md:mt-3 lg:grid lg:grid-cols-[572px_minmax(0,1fr)] lg:gap-8">
          <div className="max-md:px-7 md:grid md:grid-cols-[100px_minmax(0,444px)] md:gap-7">
            <div className="hidden flex-col gap-4 md:flex">
              {Array.from({ length: 4 }, (_, index) => (
                <Skeleton key={index} className="aspect-square w-full rounded-[6px]" />
              ))}
            </div>
            <Skeleton className="aspect-[360/340] w-full rounded-[24px] md:aspect-square md:rounded-none" />
          </div>
          <div className="flex flex-col gap-4 px-6 pt-8 md:px-0 lg:pt-0">
            <Skeleton className="h-9 w-2/3" />
            <Skeleton className="h-7 w-1/3" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-7 w-1/2" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-16 w-2/3" />
          </div>
        </div>
      </div>
    </div>
  )
}
