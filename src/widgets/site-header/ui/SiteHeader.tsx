import { Link } from '@tanstack/react-router'
import { Logo } from '@/shared/ui'
import { HeaderActions } from './HeaderActions'
import { HeaderNav } from './HeaderNav'

export function SiteHeader() {
  return (
    <header className="relative z-30 hidden md:block">
      <div className="page-container">
        <div className="flex h-[68px] items-center justify-between border-b border-[#442c1a]">
          <Link to="/" className="text-body text-foreground">
            <Logo />
          </Link>
          <HeaderNav />
          <HeaderActions />
        </div>
      </div>
    </header>
  )
}
