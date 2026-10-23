import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'

interface CatalogTabButtonProps {
  active: boolean
  onClick: () => void
  children: ReactNode
}

export function CatalogTabButton({ active, onClick, children }: CatalogTabButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'relative shrink-0 pb-1 text-[14px] leading-5 whitespace-nowrap transition-colors hover:text-text-accent md:text-body',
        active
          ? 'font-medium text-text-accent after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-brand'
          : 'text-foreground md:font-medium',
      )}
    >
      {children}
    </button>
  )
}
