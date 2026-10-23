import type { UseFormReturn } from 'react-hook-form'
import { NFT_NETWORK_LABELS, NFT_NETWORKS, WALLET_PROVIDER_LABELS, WALLET_PROVIDERS } from '@/shared/contracts'
import { cn, useFormFields } from '@/shared/lib'
import { EnsNameInput, Field, SelectInput, TextInput } from '@/shared/ui'
import type { WalletValues } from '../model'

interface WalletFieldsProps {
  form: UseFormReturn<WalletValues>
  handleLabel: string
  handleAutoComplete?: string
  className?: string
}

export function WalletFields({ form, handleLabel, handleAutoComplete = 'off', className }: WalletFieldsProps) {
  const fields = useFormFields(form)
  const displayName = fields('displayName')
  const handle = fields('handle')
  const network = fields('network')
  const profileName = fields('profileName')
  const address = fields('address')
  const secondaryAddress = fields('secondaryAddress')
  const provider = fields('provider')
  const referralCode = fields('referralCode')
  const email = fields('email')
  const ensLabel = fields('ensLabel')

  return (
    <div className={cn('grid gap-x-6 gap-y-5 md:grid-cols-2', className)}>
      <Field {...displayName.field} label="Nome de exibição" required>
        <TextInput autoComplete="name" {...displayName.control} />
      </Field>
      <Field {...handle.field} label={handleLabel} required>
        <TextInput autoComplete={handleAutoComplete} {...handle.control} />
      </Field>
      <Field {...network.field} label="Rede" required>
        <SelectInput {...network.control}>
          <option value="">Selecione uma rede</option>
          {NFT_NETWORKS.map((value) => (
            <option key={value} value={value}>
              {NFT_NETWORK_LABELS[value]}
            </option>
          ))}
        </SelectInput>
      </Field>
      <Field {...profileName.field} label="Nome do perfil" required>
        <TextInput autoComplete="off" {...profileName.control} />
      </Field>
      <Field {...address.field} label="Endereço da carteira" required>
        <TextInput autoComplete="off" spellCheck={false} placeholder="Endereço 0x da carteira" {...address.control} />
      </Field>
      <Field
        {...secondaryAddress.field}
        label="ENS ou carteira secundária (opcional)"
        hideLabel
        className="md:pt-[31px]"
      >
        <TextInput
          autoComplete="off"
          spellCheck={false}
          placeholder="ENS ou carteira secundária (opcional)"
          {...secondaryAddress.control}
        />
      </Field>
      <Field {...provider.field} label="Tipo de carteira" required>
        <SelectInput {...provider.control}>
          <option value="">Selecione uma carteira</option>
          {WALLET_PROVIDERS.map((value) => (
            <option key={value} value={value}>
              {WALLET_PROVIDER_LABELS[value]}
            </option>
          ))}
        </SelectInput>
      </Field>
      <Field {...referralCode.field} label="Código de indicação" required>
        <TextInput autoComplete="off" {...referralCode.control} />
      </Field>
      <Field {...email.field} label="E-mail" required>
        <TextInput type="email" autoComplete="email" {...email.control} />
      </Field>
      <Field {...ensLabel.field} label="Nome ENS" required>
        <EnsNameInput suffixProps={form.register('ensSuffix')} {...ensLabel.control} />
      </Field>
    </div>
  )
}
