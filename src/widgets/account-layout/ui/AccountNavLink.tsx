import { Link } from '@tanstack/react-router'
import { cn } from '@/shared/lib'
import { ComingSoon } from '@/shared/ui'
import type { AccountNavItem } from '../model'

const itemClass =
  'relative flex h-[45px] shrink-0 items-center gap-3 px-4 text-body text-text-accent transition-colors whitespace-nowrap'

export function AccountNavLink({ item }: { item: AccountNavItem }) {
  const Icon = item.icon
  const content = (
    <>
      <Icon className="size-[18px] shrink-0" aria-hidden="true" />
      {item.label}
    </>
  )

  if (!item.to) {
    return <ComingSoon className={cn(itemClass, 'opacity-80')}>{content}</ComingSoon>
  }

  return (
    <Link
      to={item.to}
      className={cn(itemClass, 'hover:bg-surface-raised')}
      activeProps={{
        'aria-current': 'page',
        className:
          'bg-surface-raised/40 font-medium before:absolute before:inset-y-0 before:left-0 before:w-[5px] before:bg-brand',
      }}
    >
      {content}
    </Link>
  )
}
