import { Link } from '@tanstack/react-router'
import { EllipsisVertical } from 'lucide-react'
import { useId } from 'react'
import { NFT_NETWORK_LABELS, type WalletDto } from '@/shared/contracts'
import { cn, shortenAddress } from '@/shared/lib'
import { RadioGroup, RadioGroupItem } from '@/shared/ui'

interface WalletOptionsProps {
  wallets: WalletDto[]
  selectedId: string | null
  onSelect: (wallet: WalletDto) => void
}

export function WalletOptions({ wallets, selectedId, onSelect }: WalletOptionsProps) {
  const id = useId()

  return (
    <RadioGroup
      value={selectedId ?? ''}
      onValueChange={(walletId) => {
        const wallet = wallets.find((item) => item.id === walletId)
        if (wallet) onSelect(wallet)
      }}
      aria-label="Carteira cadastrada"
      className="gap-5"
    >
      {wallets.map((wallet) => {
        const itemId = `${id}-${wallet.id}`
        return (
          <div
            key={wallet.id}
            className={cn(
              'flex items-start gap-4 rounded-[12px] bg-surface-card px-4 py-3.5',
              wallet.id === selectedId && 'ring-1 ring-brand',
            )}
          >
            <RadioGroupItem id={itemId} value={wallet.id} className="mt-5" />
            <label htmlFor={itemId} className="flex-1 cursor-pointer">
              <span className="block text-body-md font-bold text-foreground">{wallet.nickname}</span>
              <span className="block text-body text-text-secondary">
                {wallet.slot === 'secondary' ? wallet.ensName : shortenAddress(wallet.address)}
              </span>
              <span className="block text-caption text-text-secondary">
                Rede {wallet.network === 'ethereum' ? 'principal Ethereum' : NFT_NETWORK_LABELS[wallet.network]}
              </span>
            </label>
            <Link
              to="/wallets"
              aria-label={`Editar carteira ${wallet.nickname}`}
              className="grid size-8 place-items-center text-text-secondary hover:text-text-accent"
            >
              <EllipsisVertical className="size-5" aria-hidden="true" />
            </Link>
          </div>
        )
      })}
    </RadioGroup>
  )
}
