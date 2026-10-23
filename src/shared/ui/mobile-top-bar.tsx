import { cn } from '@/shared/lib'
import { ChevronLeft } from 'lucide-react'
import type { ReactNode } from 'react'

interface MobileTopBarProps {
  title?: string
  onBack: () => void
  action?: ReactNode
  className?: string
}

const circleClass =
  'grid size-9 place-items-center rounded-full bg-surface-raised text-text-secondary transition-colors hover:text-text-accent'

function MobileTopBar({ title, onBack, action, className }: MobileTopBarProps) {
  return (
    <div data-slot="mobile-top-bar" className={cn('flex items-center gap-4 md:hidden', className)}>
      <button type="button" onClick={onBack} aria-label="Voltar" className={circleClass}>
        <ChevronLeft className="size-5" aria-hidden="true" />
      </button>
      {title && <h1 className="flex-1 text-[20px] leading-7 font-bold text-foreground">{title}</h1>}
      {!title && <span className="flex-1" />}
      {action}
    </div>
  )
}

export { MobileTopBar, circleClass as mobileTopBarActionClass }
