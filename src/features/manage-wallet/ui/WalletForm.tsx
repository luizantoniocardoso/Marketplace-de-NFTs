import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { getApiError } from '@/shared/api'
import type { WalletSlot } from '@/shared/contracts'
import { applyFieldErrors, standardResolver } from '@/shared/lib'
import { Button } from '@/shared/ui'
import {
  mapWalletApiFields,
  toWalletRequest,
  useSaveWallet,
  WALLET_FORM_FIELDS,
  walletSchema,
  type WalletValues,
} from '../model'
import { WalletFields } from './WalletFields'

interface WalletFormProps {
  slot: WalletSlot
  defaultValues: WalletValues
  onSaved?: () => void
}

export function WalletForm({ slot, defaultValues, onSaved }: WalletFormProps) {
  const [formError, setFormError] = useState<string>()
  const save = useSaveWallet()
  const form = useForm<WalletValues>({ resolver: standardResolver(walletSchema), defaultValues })

  const onSubmit = form.handleSubmit((values) => {
    setFormError(undefined)
    save.mutate(
      { slot, body: toWalletRequest(values) },
      {
        onSuccess: () => {
          form.reset(values)
          onSaved?.()
        },
        onError: (error) => {
          const apiError = getApiError(error)
          if (!applyFieldErrors(form.setError, mapWalletApiFields(apiError.fields), WALLET_FORM_FIELDS)) {
            setFormError(apiError.message)
          }
        },
      },
    )
  })

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-8">
      <WalletFields form={form} handleLabel="Apelido da carteira" />
      {formError && (
        <p role="alert" className="text-body text-coral">
          {formError}
        </p>
      )}
      <Button type="submit" variant="brand" size="md" className="w-fit px-2" disabled={save.isPending}>
        {save.isPending ? 'Salvando…' : 'Salvar carteira'}
      </Button>
    </form>
  )
}
