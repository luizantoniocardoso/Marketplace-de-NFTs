import { AlertTriangle } from 'lucide-react'
import { useProfile } from '@/entities/user'
import { useWallets } from '@/entities/wallet'
import { getApiError } from '@/shared/api'
import { useDocumentTitle } from '@/shared/lib'
import { Button, StateMessage } from '@/shared/ui'
import { PrimaryWalletSection } from './PrimaryWalletSection'
import { SecondaryWalletSection } from './SecondaryWalletSection'
import { WalletsSkeleton } from './WalletsSkeleton'

export function WalletsPage() {
  useDocumentTitle('Carteiras')
  const wallets = useWallets()
  const profile = useProfile()

  if (wallets.isPending) return <WalletsSkeleton />

  if (wallets.isError) {
    return (
      <StateMessage
        role="alert"
        icon={AlertTriangle}
        iconClassName="text-coral"
        title="Não foi possível carregar suas carteiras"
        description={getApiError(wallets.error).message}
        action={
          <Button variant="brand" size="md" onClick={() => wallets.refetch()}>
            Tentar novamente
          </Button>
        }
      />
    )
  }

  const primary = wallets.data.find((wallet) => wallet.slot === 'primary') ?? null
  const secondary = wallets.data.find((wallet) => wallet.slot === 'secondary') ?? null

  return (
    <div className="flex flex-col gap-10">
      <PrimaryWalletSection wallet={primary} profile={profile.data} />
      <SecondaryWalletSection wallet={secondary} primary={primary} />
    </div>
  )
}
