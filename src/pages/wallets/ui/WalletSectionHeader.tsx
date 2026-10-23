import type { ReactNode } from 'react'

interface WalletSectionHeaderProps {
  id: string
  title: string
  description: string
  actions?: ReactNode
}

export function WalletSectionHeader({ id, title, description, actions }: WalletSectionHeaderProps) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
      <div>
        <h2 id={id} className="text-body-lg font-bold text-foreground">
          {title}
        </h2>
        <p className="mt-0.5 text-caption text-text-secondary md:text-body">{description}</p>
      </div>
      {actions}
    </header>
  )
}
