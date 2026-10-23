import { cn } from '@/shared/lib'
import type { ComponentProps } from 'react'

function SkipLink({ className, children, ...props }: ComponentProps<'a'>) {
  return (
    <a
      data-slot="skip-link"
      className={cn(
        'fixed top-2 left-2 z-50 -translate-y-20 rounded-md bg-brand px-4 py-2 font-bold text-ink focus-visible:translate-y-0',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  )
}

export { SkipLink }
