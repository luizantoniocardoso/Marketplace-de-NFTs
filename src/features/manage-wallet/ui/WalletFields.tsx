import { useId } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import {
  ENS_SUFFIXES,
  NFT_NETWORK_LABELS,
  NFT_NETWORKS,
  WALLET_PROVIDER_LABELS,
  WALLET_PROVIDERS,
} from '@/shared/contracts'
import { cn } from '@/shared/lib'
import { Field, fieldDescribedBy, SelectInput, TextInput } from '@/shared/ui'
import type { WalletValues } from '../model'

interface WalletFieldsProps {
  form: UseFormReturn<WalletValues>
  handleLabel: string
  handleAutoComplete?: string
  className?: string
}

export function WalletFields({ form, handleLabel, handleAutoComplete = 'off', className }: WalletFieldsProps) {
  const id = useId()
  const {
    register,
    formState: { errors },
  } = form
  const fieldId = (name: keyof WalletValues) => `${id}-${name}`

  const control = (name: keyof WalletValues) => ({
    id: fieldId(name),
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': fieldDescribedBy(fieldId(name), errors[name]?.message),
    ...register(name),
  })

  return (
    <div className={cn('grid gap-x-6 gap-y-5 md:grid-cols-2', className)}>
      <Field id={fieldId('displayName')} label="Nome de exibição" required error={errors.displayName?.message}>
        <TextInput autoComplete="name" {...control('displayName')} />
      </Field>
      <Field id={fieldId('handle')} label={handleLabel} required error={errors.handle?.message}>
        <TextInput autoComplete={handleAutoComplete} {...control('handle')} />
      </Field>
      <Field id={fieldId('network')} label="Rede" required error={errors.network?.message}>
        <SelectInput {...control('network')}>
          <option value="">Selecione uma rede</option>
          {NFT_NETWORKS.map((network) => (
            <option key={network} value={network}>
              {NFT_NETWORK_LABELS[network]}
            </option>
          ))}
        </SelectInput>
      </Field>
      <Field id={fieldId('profileName')} label="Nome do perfil" required error={errors.profileName?.message}>
        <TextInput autoComplete="off" {...control('profileName')} />
      </Field>
      <Field id={fieldId('address')} label="Endereço da carteira" required error={errors.address?.message}>
        <TextInput autoComplete="off" spellCheck={false} placeholder="Endereço 0x da carteira" {...control('address')} />
      </Field>
      <Field
        id={fieldId('secondaryAddress')}
        label="ENS ou carteira secundária (opcional)"
        hideLabel
        error={errors.secondaryAddress?.message}
        className="md:pt-[31px]"
      >
        <TextInput
          autoComplete="off"
          spellCheck={false}
          placeholder="ENS ou carteira secundária (opcional)"
          {...control('secondaryAddress')}
        />
      </Field>
      <Field id={fieldId('provider')} label="Tipo de carteira" required error={errors.provider?.message}>
        <SelectInput {...control('provider')}>
          <option value="">Selecione uma carteira</option>
          {WALLET_PROVIDERS.map((provider) => (
            <option key={provider} value={provider}>
              {WALLET_PROVIDER_LABELS[provider]}
            </option>
          ))}
        </SelectInput>
      </Field>
      <Field id={fieldId('referralCode')} label="Código de indicação" required error={errors.referralCode?.message}>
        <TextInput autoComplete="off" {...control('referralCode')} />
      </Field>
      <Field id={fieldId('email')} label="E-mail" required error={errors.email?.message}>
        <TextInput type="email" autoComplete="email" {...control('email')} />
      </Field>
      <Field id={fieldId('ensLabel')} label="Nome ENS" required error={errors.ensLabel?.message}>
        <div className="flex gap-2.5">
          <SelectInput aria-label="Domínio ENS" className="w-auto min-w-[78px] px-2.5" {...register('ensSuffix')}>
            {ENS_SUFFIXES.map((suffix) => (
              <option key={suffix} value={suffix}>
                {suffix}
              </option>
            ))}
          </SelectInput>
          <TextInput className="flex-1" autoComplete="off" {...control('ensLabel')} />
        </div>
      </Field>
    </div>
  )
}
