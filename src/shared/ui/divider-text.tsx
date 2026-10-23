import { cn } from '@/shared/lib'
import type { ReactNode } from 'react'

function DividerText({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div data-slot="divider-text" className={cn('flex items-center gap-3 text-caption text-foreground', className)}>
      <span aria-hidden="true" className="h-px flex-1 bg-border" />
      <span>{children}</span>
      <span aria-hidden="true" className="h-px flex-1 bg-border" />
    </div>
  )
}

export { DividerText }
