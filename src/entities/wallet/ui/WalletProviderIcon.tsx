import { Wallet } from 'lucide-react'
import type { WalletProvider } from '@/shared/contracts'
import { cn } from '@/shared/lib'

const LETTERS: Partial<Record<WalletProvider, string>> = {
  walletconnect: 'W',
  metamask: 'M',
}

export function WalletProviderIcon({ provider, className }: { provider: WalletProvider; className?: string }) {
  const letter = LETTERS[provider]

  return (
    <span
      aria-hidden="true"
      className={cn(
        'grid size-10 shrink-0 place-items-center rounded-full border border-border-soft bg-surface-dark text-body font-bold text-text-accent',
        className,
      )}
    >
      {letter ?? <Wallet className="size-5" />}
    </span>
  )
}
