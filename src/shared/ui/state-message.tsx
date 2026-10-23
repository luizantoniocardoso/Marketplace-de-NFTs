import { cn } from 'cn'
import type { LucideIcon } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'

interface StateMessageProps extends Omit<ComponentProps<'div'>, 'title'> {
  icon: LucideIcon
  iconClassName?: string
  title: ReactNode
  description: ReactNode
  action?: ReactNode
}

function StateMessage({ icon: Icon, iconClassName, title, description, action, className, ...props }: StateMessageProps) {
  return (
    <div
      data-slot="state-message"
      className={cn('flex flex-col items-center gap-3 rounded-xl bg-surface-card px-6 py-12 text-center', className)}
      {...props}
    >
      <Icon className={cn('size-8 text-text-secondary', iconClassName)} aria-hidden="true" />
      <p className="text-body-lg font-bold">{title}</p>
      <p className="max-w-md text-body text-text-secondary">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

export { StateMessage }
