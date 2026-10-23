import { useId } from 'react'
import { walletDefaults, WalletForm } from '@/features/manage-wallet'
import type { UserDto, WalletDto } from '@/shared/contracts'
import { WalletSectionHeader } from './WalletSectionHeader'

interface PrimaryWalletSectionProps {
  wallet: WalletDto | null
  profile?: UserDto
}

export function PrimaryWalletSection({ wallet, profile }: PrimaryWalletSectionProps) {
  const titleId = useId()
  const defaults = walletDefaults(wallet, {
    displayName: profile?.displayName,
    handle: profile?.walletNickname ?? 'Principal',
    profileName: profile?.username,
    email: profile?.email,
  })

  return (
    <section aria-labelledby={titleId} className="flex flex-col gap-6">
      <WalletSectionHeader
        id={titleId}
        title="Carteira principal"
        description="Estas carteiras ficam disponíveis no pagamento e para receber NFTs comprados."
        actions={!wallet && <span className="text-body-md font-bold text-text-accent">Adicionar</span>}
      />
      <WalletForm key={wallet?.updatedAt ?? 'new-primary'} slot="primary" defaultValues={defaults} />
    </section>
  )
}
