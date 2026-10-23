import { useForm } from 'react-hook-form'
import { getApiError } from '@/shared/api'
import type { WalletSlot } from '@/shared/contracts'
import { standardResolver, useServerErrors } from '@/shared/lib'
import { Button, FormError } from '@/shared/ui'
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
  const save = useSaveWallet()
  const form = useForm<WalletValues>({ resolver: standardResolver(walletSchema), defaultValues })
  const serverErrors = useServerErrors(form.setError, WALLET_FORM_FIELDS)

  const onSubmit = form.handleSubmit((values) => {
    serverErrors.clear()
    save.mutate(
      { slot, body: toWalletRequest(values) },
      {
        onSuccess: () => {
          form.reset(values)
          onSaved?.()
        },
        onError: (error) => {
          const { message, fields } = getApiError(error)
          serverErrors.report({ message, fields: mapWalletApiFields(fields) })
        },
      },
    )
  })

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-8">
      <WalletFields form={form} handleLabel="Apelido da carteira" />
      {serverErrors.formError && <FormError>{serverErrors.formError}</FormError>}
      <Button type="submit" variant="brand" size="md" className="w-fit px-2" disabled={save.isPending}>
        {save.isPending ? 'Salvando…' : 'Salvar carteira'}
      </Button>
    </form>
  )
}
