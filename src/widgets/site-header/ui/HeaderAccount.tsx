import { Link } from '@tanstack/react-router'
import { LogIn } from 'lucide-react'
import { useSession } from '@/entities/session'
import { UserAvatar } from '@/entities/user'

const buttonClass =
  'flex h-8 items-center gap-1.5 rounded-md bg-brand px-2 text-body-md font-medium text-ink transition-colors hover:bg-brand-light'

export function HeaderAccount() {
  const { user } = useSession()

  if (user) {
    return (
      <Link to="/profile" className={buttonClass} aria-label={`Meu perfil, ${user.displayName}`}>
        <UserAvatar user={user} className="size-6 border-ink/30 bg-ink/20 text-ink" />
        <span className="max-w-[110px] truncate">{user.displayName.split(' ')[0]}</span>
      </Link>
    )
  }

  return (
    <Link to="." search={(prev) => ({ ...prev, auth: 'login' as const })} resetScroll={false} className={buttonClass}>
      <LogIn className="size-[18px]" aria-hidden="true" />
      Entrar
    </Link>
  )
}
