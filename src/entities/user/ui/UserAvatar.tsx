import { ImageIcon } from 'lucide-react'
import type { UserDto } from '@/shared/contracts'
import { cn } from '@/shared/lib'

interface UserAvatarProps {
  user: Pick<UserDto, 'displayName' | 'avatarUrl'> | null
  className?: string
}

export function UserAvatar({ user, className }: UserAvatarProps) {
  return (
    <span
      className={cn(
        'grid size-[50px] shrink-0 place-items-center overflow-hidden rounded-full border border-border-soft bg-surface-dark text-text-accent',
        className,
      )}
    >
      {user?.avatarUrl ? (
        <img src={user.avatarUrl} alt={`Avatar de ${user.displayName}`} className="size-full object-cover" />
      ) : (
        <ImageIcon className="size-1/2" aria-hidden="true" />
      )}
    </span>
  )
}
