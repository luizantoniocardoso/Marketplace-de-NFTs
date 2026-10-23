import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { Skeleton } from '@/shared/ui'

interface SummaryRowProps {
  label: ReactNode
  value?: ReactNode
  hint?: ReactNode
  emphasis?: boolean
  loading?: boolean
  className?: string
}

export function SummaryRow({ label, value, hint, emphasis, loading, className }: SummaryRowProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      <div className="flex items-center justify-between gap-4">
        <dt className={cn('text-body text-foreground', emphasis && 'font-bold')}>{label}</dt>
        <dd className={cn('text-right text-foreground', emphasis ? 'text-body-lg font-bold text-text-accent' : 'text-body-md')}>
          {loading ? <Skeleton className="h-5 w-24" /> : value}
        </dd>
      </div>
      {hint && <p className="mt-1 self-end text-tiny text-text-accent">{hint}</p>}
    </div>
  )
}
