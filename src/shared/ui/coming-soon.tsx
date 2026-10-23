import { cn } from 'cn'
import type { ComponentProps } from 'react'

function ComingSoon({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      data-slot="coming-soon"
      aria-disabled="true"
      title="Em breve"
      className={cn('cursor-not-allowed', className)}
      {...props}
    />
  )
}

export { ComingSoon }
