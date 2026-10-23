import { X } from 'lucide-react'
import { useId, useState } from 'react'
import { getApiError } from '@/shared/api'
import type { CouponDto } from '@/shared/contracts'
import { cn } from '@/shared/lib'
import { useApplyCoupon, useRemoveCoupon } from '../model'

interface CouponFormProps {
  coupon: CouponDto | null
  variant?: 'box' | 'pill'
  disabled?: boolean
  className?: string
}

export function CouponForm({ coupon, variant = 'box', disabled, className }: CouponFormProps) {
  const id = useId()
  const [code, setCode] = useState('')
  const [error, setError] = useState<string>()
  const apply = useApplyCoupon()
  const remove = useRemoveCoupon()
  const pill = variant === 'pill'

  if (coupon) {
    return (
      <div className={cn('flex items-center justify-between gap-3 rounded-[4px] border border-brand/60 px-3 py-2', className)}>
        <p className="text-body text-foreground">
          <span className="font-bold text-text-accent">{coupon.code}</span>
          <span className="block text-caption text-text-secondary">{coupon.description}</span>
        </p>
        <button
          type="button"
          onClick={() => remove.mutate()}
          disabled={remove.isPending}
          aria-label={`Remover cupom ${coupon.code}`}
          className="grid size-8 place-items-center rounded-full text-text-secondary hover:text-coral"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
    )
  }

  return (
    <form
      noValidate
      className={className}
      onSubmit={(event) => {
        event.preventDefault()
        setError(undefined)
        if (!code.trim()) {
          setError('Informe um código promocional.')
          return
        }
        apply.mutate(code.trim(), {
          onSuccess: () => setCode(''),
          onError: (err) => {
            const apiError = getApiError(err)
            setError(apiError.fields?.code ?? apiError.message)
          },
        })
      }}
    >
      <label htmlFor={id} className={cn('text-body font-bold text-foreground', pill && 'sr-only')}>
        Código promocional
      </label>
      <div
        className={cn(
          'flex overflow-hidden',
          pill ? 'h-[50px] rounded-full border border-border bg-ink' : 'mt-3 h-10 rounded-[2px] border border-border-soft',
        )}
      >
        <input
          id={id}
          value={code}
          onChange={(event) => setCode(event.target.value.toUpperCase())}
          placeholder="Digite o código promocional..."
          autoComplete="off"
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            'min-w-0 flex-1 bg-transparent text-caption text-foreground placeholder:text-tan focus-visible:outline-none',
            pill ? 'px-4 text-body' : 'px-2',
          )}
        />
        <button
          type="submit"
          disabled={disabled || apply.isPending}
          className={cn(
            'shrink-0 font-bold text-ink transition-colors disabled:opacity-60',
            pill
              ? 'rounded-full bg-gradient-to-r from-brand to-[#a8703f] px-4 text-body-md'
              : 'bg-brand px-5 text-body-md hover:bg-brand-light',
          )}
        >
          {apply.isPending ? 'Aplicando…' : 'Aplicar'}
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-caption text-coral">
          {error}
        </p>
      )}
    </form>
  )
}
