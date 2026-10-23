import { cn } from 'cn'
import type { ComponentProps } from 'react'

function Logo({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span data-slot="logo" className={cn('font-bold tracking-[0.12em]', className)} {...props}>
      KURIO
    </span>
  )
}

export { Logo }
