import { LogOut } from 'lucide-react'
import { useLogout } from '@/features/auth-logout'
import { ACCOUNT_NAV_ITEMS } from '../model'
import { AccountNavLink } from './AccountNavLink'

export function AccountSidebar() {
  const logout = useLogout()

  return (
    <aside aria-labelledby="account-nav-title" className="h-fit bg-surface-card pt-4 md:pt-[18px]">
      <h2 id="account-nav-title" className="px-2.5 text-title font-bold text-foreground">
        Meu perfil
      </h2>
      <nav aria-label="Conta" className="mt-1">
        <ul className="flex overflow-x-auto [scrollbar-width:none] md:flex-col md:overflow-visible">
          {ACCOUNT_NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <AccountNavLink item={item} />
            </li>
          ))}
        </ul>
      </nav>
      <div className="border-t border-border-soft">
        <button
          type="button"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          className="flex h-12 w-full items-center gap-3 px-4 text-body font-bold text-text-accent hover:bg-surface-raised disabled:opacity-60"
        >
          <LogOut className="size-5" aria-hidden="true" />
          {logout.isPending ? 'Saindo…' : 'Sair'}
        </button>
      </div>
    </aside>
  )
}
