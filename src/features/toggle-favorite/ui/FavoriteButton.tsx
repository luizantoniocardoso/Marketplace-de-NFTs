import { useNavigate, useRouterState } from '@tanstack/react-router'
import { Heart } from 'lucide-react'
import { useIsFavorite } from '@/entities/favorite'
import { useSession } from '@/entities/session'
import { cn } from '@/shared/lib'
import { Button, mobileTopBarActionClass } from '@/shared/ui'
import { useToggleFavorite } from '../model'

interface FavoriteButtonProps {
  nftId: string
  nftName: string
  variant?: 'outline' | 'icon'
  className?: string
}

export function FavoriteButton({ nftId, nftName, variant = 'outline', className }: FavoriteButtonProps) {
  const navigate = useNavigate()
  const href = useRouterState({ select: (state) => state.location.href })
  const { viewerId } = useSession()
  const favorite = useIsFavorite(nftId)
  const toggle = useToggleFavorite()

  const onClick = () => {
    if (!viewerId) {
      void navigate({ to: '/login', search: { redirect: href } })
      return
    }
    toggle.mutate({ nftId, nftName, favorite: !favorite })
  }

  const label = favorite ? `Remover ${nftName} dos favoritos` : `Adicionar ${nftName} aos favoritos`
  const icon = <Heart className={cn('size-5', favorite && 'fill-current')} aria-hidden="true" />

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={favorite}
        aria-label={label}
        className={cn(mobileTopBarActionClass, favorite && 'text-brand', className)}
      >
        {icon}
      </button>
    )
  }

  return (
    <Button
      type="button"
      variant="brand-outline"
      size="md"
      onClick={onClick}
      aria-pressed={favorite}
      aria-label={label}
      className={cn('h-9 rounded-[4px] px-3 text-body-md', favorite && 'bg-brand/15', className)}
    >
      {icon}
      {favorite ? 'Favoritado' : 'Favoritar'}
    </Button>
  )
}
