import { Link } from '@tanstack/react-router'
import { cn } from '@/shared/lib'
import { Fragment } from 'react'
import { CATALOG_SECTION_ID } from '@/shared/config'

interface MarketBreadcrumbsProps {
  trail?: string[]
  className?: string
}

const linkClass = 'transition-colors hover:text-text-accent'

function MarketBreadcrumbs({ trail = [], className }: MarketBreadcrumbsProps) {
  const separator = (
    <li aria-hidden="true" className="select-none">
      /
    </li>
  )

  return (
    <nav aria-label="Trilha de navegação" className={cn('text-body font-bold text-foreground', className)}>
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link to="/" className={linkClass}>
            Início
          </Link>
        </li>
        {separator}
        <li aria-current={trail.length ? undefined : 'page'}>
          {trail.length ? (
            <Link to="/" hash={CATALOG_SECTION_ID} className={linkClass}>
              Mercado
            </Link>
          ) : (
            'Mercado'
          )}
        </li>
        {trail.map((label, index) => (
          <Fragment key={label}>
            {separator}
            <li aria-current={index === trail.length - 1 ? 'page' : undefined}>{label}</li>
          </Fragment>
        ))}
      </ol>
    </nav>
  )
}

export { MarketBreadcrumbs }
