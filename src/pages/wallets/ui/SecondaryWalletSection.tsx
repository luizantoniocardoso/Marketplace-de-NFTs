import { useId, useState } from 'react'
import { walletDefaults, WalletForm } from '@/features/manage-wallet'
import type { WalletDto } from '@/shared/contracts'
import { Checkbox } from '@/shared/ui'
import { WalletSectionHeader } from './WalletSectionHeader'

interface SecondaryWalletSectionProps {
  wallet: WalletDto | null
  primary: WalletDto | null
}

export function SecondaryWalletSection({ wallet, primary }: SecondaryWalletSectionProps) {
  const titleId = useId()
  const sameAsPrimaryId = useId()
  const [adding, setAdding] = useState(false)
  const [sameAsPrimary, setSameAsPrimary] = useState(false)
  const editing = Boolean(wallet) || adding

  const source = wallet ?? (sameAsPrimary && primary ? { ...primary, nickname: 'Reserva', address: '' } : null)
  const defaults = walletDefaults(source, { handle: 'Reserva' })

  return (
    <section aria-labelledby={titleId} className="flex flex-col gap-6">
      <WalletSectionHeader
        id={titleId}
        title="Carteira secundária"
        description={
          wallet ? 'Use como alternativa no pagamento.' : 'Você ainda não adicionou uma carteira secundária.'
        }
        actions={
          !wallet && (
            <div className="flex items-center gap-4">
              <label htmlFor={sameAsPrimaryId} className="flex items-center gap-2 text-body text-foreground">
                <Checkbox
                  id={sameAsPrimaryId}
                  checked={sameAsPrimary}
                  disabled={!primary}
                  onCheckedChange={(checked) => setSameAsPrimary(checked === true)}
                  variant="brand"
                />
                Igual à carteira principal
              </label>
              <button
                type="button"
                aria-expanded={adding}
                disabled={!primary}
                title={primary ? undefined : 'Cadastre a carteira principal primeiro'}
                onClick={() => setAdding((value) => !value)}
                className="text-body-md font-bold text-text-accent hover:text-brand-light disabled:cursor-not-allowed disabled:opacity-50"
              >
                {adding ? 'Cancelar' : 'Adicionar'}
              </button>
            </div>
          )
        }
      />
      {editing && (
        <WalletForm
          key={`${wallet?.updatedAt ?? 'new-secondary'}-${sameAsPrimary}`}
          slot="secondary"
          defaultValues={defaults}
          onSaved={() => setAdding(false)}
        />
      )}
    </section>
  )
}
