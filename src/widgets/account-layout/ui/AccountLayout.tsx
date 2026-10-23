import { Outlet } from '@tanstack/react-router'
import { AccountSidebar } from './AccountSidebar'

export function AccountLayout() {
  return (
    <div className="page-container pt-6 pb-10 md:grid md:grid-cols-[minmax(0,240px)_1fr] md:gap-7 md:pt-8 lg:grid-cols-[310px_1fr]">
      <AccountSidebar />
      <div className="mt-8 min-w-0 md:mt-0">
        <Outlet />
      </div>
    </div>
  )
}
