import type { ReactNode } from 'react'

interface FooterLinkColumnProps {
  title: string
  children: ReactNode
}

export function FooterLinkColumn({ title, children }: FooterLinkColumnProps) {
  return (
    <div>
      <h2 className="text-body-lg font-bold">{title}</h2>
      <ul className="mt-2 flex flex-col gap-1.5 text-body text-foreground">{children}</ul>
    </div>
  )
}
