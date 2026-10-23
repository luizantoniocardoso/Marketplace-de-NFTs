import { useId } from 'react'
import { WalletFields } from '@/features/manage-wallet'
import { Checkbox, TextArea } from '@/shared/ui'
import type { CheckoutController } from '../model'

interface CollectorFormProps {
  checkout: CheckoutController
  className?: string
}

const NOTE_MAX = 500

export function CollectorForm({ checkout, className }: CollectorFormProps) {
  const id = useId()
  const otherWallet = checkout.wallets.find((wallet) => wallet.id !== checkout.selectedWallet?.id)
  const usingOther = checkout.selectedWallet?.slot === 'secondary'

  return (
    <section aria-labelledby={`${id}-title`} className={className}>
      <h2 id={`${id}-title`} className="text-body-lg font-bold text-foreground">
        Perfil do colecionador
      </h2>
      <WalletFields form={checkout.form} handleLabel="Nome de usuário" handleAutoComplete="username" className="mt-3" />

      {otherWallet && (
        <label htmlFor={`${id}-other`} className="mt-7 flex w-fit items-center gap-2 text-body text-foreground">
          <Checkbox
            id={`${id}-other`}
            checked={usingOther}
            onCheckedChange={() => checkout.selectWallet(otherWallet)}
            className="rounded-full border-brand data-checked:bg-brand"
          />
          Usar outra carteira? <span className="text-text-secondary">({otherWallet.nickname})</span>
        </label>
      )}

      <div className="mt-6 flex max-w-[350px] flex-col gap-2">
        <label htmlFor={`${id}-note`} className="text-body text-foreground">
          Observação do colecionador (opcional)
        </label>
        <TextArea
          id={`${id}-note`}
          maxLength={NOTE_MAX}
          value={checkout.note}
          onChange={(event) => checkout.setNote(event.target.value)}
          aria-describedby={`${id}-note-count`}
        />
        <p id={`${id}-note-count`} className="text-right text-caption text-text-secondary">
          {checkout.note.length}/{NOTE_MAX}
        </p>
      </div>
    </section>
  )
}
