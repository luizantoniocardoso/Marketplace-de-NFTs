import { Skeleton } from '@/shared/ui'

export function FacetListSkeleton({ rows }: { rows: number }) {
  return Array.from({ length: rows }, (_, index) => (
    <li key={index} className="flex h-[34px] items-center px-2.5">
      <Skeleton className="h-4 w-full" />
    </li>
  ))
}
