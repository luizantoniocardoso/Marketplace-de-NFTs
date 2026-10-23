import { AlertTriangle } from 'lucide-react'
import { useProfile } from '@/entities/user'
import { ProfileForm } from '@/features/edit-profile'
import { AvatarField } from '@/features/update-avatar'
import { getApiError } from '@/shared/api'
import { Button, StateMessage } from '@/shared/ui'
import { ProfileSkeleton } from './ProfileSkeleton'

export function ProfilePage() {
  const { data: user, error, isPending, refetch } = useProfile()

  return (
    <section aria-labelledby="profile-title">
      <h1 id="profile-title" className="text-body-md font-bold text-foreground md:mt-1">
        Perfil do colecionador
      </h1>
      <div className="mt-8">
        {user ? (
          <ProfileForm key={user.id} user={user} avatarSlot={<AvatarField user={user} />} />
        ) : isPending ? (
          <ProfileSkeleton />
        ) : (
          <StateMessage
            role="alert"
            icon={AlertTriangle}
            iconClassName="text-coral"
            title="Não foi possível carregar seu perfil"
            description={getApiError(error).message}
            action={
              <Button variant="brand" size="md" onClick={() => refetch()}>
                Tentar novamente
              </Button>
            }
          />
        )}
      </div>
    </section>
  )
}
