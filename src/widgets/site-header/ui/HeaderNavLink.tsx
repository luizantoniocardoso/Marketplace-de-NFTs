import { Link, useRouterState } from '@tanstack/react-router'
import { cn } from '@/shared/lib'
import { ComingSoon } from '@/shared/ui'
import type { NavItem } from '../model'

const navItemClass =
  'relative flex h-full items-center px-0.5 text-body-md text-foreground transition-colors hover:text-text-accent'

export function HeaderNavLink({ item }: { item: NavItem }) {
  const location = useRouterState({ select: (state) => state.location })

  if (!item.to) {
    return <ComingSoon className={cn(navItemClass, 'hover:text-foreground')}>{item.label}</ComingSoon>
  }

  const active = location.pathname === item.to && (item.hash ? location.hash === item.hash : !location.hash)

  return (
    <Link
      to={item.to}
      hash={item.hash}
      aria-current={active ? 'page' : undefined}
      className={cn(
        navItemClass,
        active &&
          'font-bold text-text-accent after:absolute after:inset-x-0 after:-bottom-px after:h-[3px] after:rounded-full after:bg-brand',
      )}
    >
      {item.label}
    </Link>
  )
}
