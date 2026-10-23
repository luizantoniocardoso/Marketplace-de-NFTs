import { useId } from 'react'
import { WalletProviderIcon } from '@/entities/wallet'
import { WALLET_PROVIDER_LABELS, WALLET_PROVIDERS, type WalletProvider } from '@/shared/contracts'
import { cn } from '@/shared/lib'
import { RadioGroup, RadioGroupItem } from '@/shared/ui'

interface ProviderOptionsProps {
  value: WalletProvider | ''
  onChange: (provider: WalletProvider) => void
  variant: 'panel' | 'card'
  error?: string
}

export function ProviderOptions({ value, onChange, variant, error }: ProviderOptionsProps) {
  const id = useId()

  return (
    <div>
      <RadioGroup
        value={value}
        onValueChange={(next) => onChange(next as WalletProvider)}
        aria-label="Tipo de carteira"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={variant === 'card' ? 'gap-4' : 'gap-4'}
      >
        {WALLET_PROVIDERS.map((provider) => {
          const itemId = `${id}-${provider}`
          const selected = value === provider
          return (
            <label
              key={provider}
              htmlFor={itemId}
              className={cn(
                'flex cursor-pointer items-center gap-4 transition-colors',
                variant === 'panel'
                  ? cn('h-[45px] border px-3.5', selected ? 'border-brand' : 'border-border hover:border-border-soft')
                  : cn('h-16 rounded-[12px] bg-surface-card px-4', selected && 'ring-1 ring-brand'),
              )}
            >
              <RadioGroupItem id={itemId} value={provider} className={variant === 'card' ? 'order-last' : undefined} />
              {variant === 'card' && <WalletProviderIcon provider={provider} />}
              <span className={cn('text-body text-foreground', variant === 'card' && 'mr-auto')}>
                {WALLET_PROVIDER_LABELS[provider]}
              </span>
            </label>
          )
        })}
      </RadioGroup>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-caption text-coral">
          {error}
        </p>
      )}
    </div>
  )
}
