import { Link } from '@tanstack/react-router'
import type { ComponentProps } from 'react'

interface TabBarLinkProps extends ComponentProps<typeof Link> {
  label: string
}

export function TabBarLink({ label, ...props }: TabBarLinkProps) {
  return (
    <Link
      aria-label={label}
      activeOptions={{ exact: true, includeSearch: false }}
      className="grid size-12 place-items-center rounded-full text-tan transition-colors hover:text-text-accent data-[status=active]:text-brand"
      {...props}
    />
  )
}
