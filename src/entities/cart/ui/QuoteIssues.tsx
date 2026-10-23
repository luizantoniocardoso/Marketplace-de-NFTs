import type { QuoteDto } from '@/shared/contracts'
import { cn } from '@/shared/lib'

export function QuoteIssues({ quote, className }: { quote?: QuoteDto; className?: string }) {
  if (!quote?.issues.length) return null

  return (
    <ul aria-live="polite" className={cn('flex flex-col gap-1 text-caption text-amber', className)}>
      {quote.issues.map((issue) => (
        <li key={issue}>{issue}</li>
      ))}
    </ul>
  )
}
