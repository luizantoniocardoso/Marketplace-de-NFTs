import { z } from 'zod/mini'
import {
  NFT_NETWORKS,
  WALLET_PROVIDERS,
  type NftNetwork,
  type UpsertWalletRequest,
  type WalletDto,
  type WalletProvider,
} from '@/shared/contracts'
import { isWalletAddress, rules, splitEnsName } from '@/shared/lib'

const isNetwork = (value: string): value is NftNetwork => (NFT_NETWORKS as readonly string[]).includes(value)
const isProvider = (value: string): value is WalletProvider => (WALLET_PROVIDERS as readonly string[]).includes(value)

export const walletSchema = z
  .object({
    displayName: rules.required('Informe o nome de exibição.'),
    handle: rules.required('Preencha este campo.'),
    network: z.string().check(z.refine(isNetwork, { error: 'Selecione uma rede.' })),
    profileName: rules.required('Informe o nome do perfil.'),
    address: rules.required('Informe o endereço da carteira.'),
    secondaryAddress: z.string().check(z.trim()),
    provider: z.string().check(z.refine(isProvider, { error: 'Selecione o tipo de carteira.' })),
    referralCode: rules.required('Informe o código de indicação.'),
    email: rules.email(),
    ensSuffix: rules.ensSuffix(),
    ensLabel: rules.ensLabel(),
  })
  .check(
    z.refine((values) => !isNetwork(values.network) || isWalletAddress(values.address, values.network), {
      error: 'Endereço inválido para a rede selecionada.',
      path: ['address'],
    }),
    z.refine(
      (values) =>
        !values.secondaryAddress ||
        values.secondaryAddress.endsWith('.eth') ||
        (isNetwork(values.network) && isWalletAddress(values.secondaryAddress, values.network)),
      { error: 'Informe um ENS ou endereço válido.', path: ['secondaryAddress'] },
    ),
  )

export type WalletValues = z.infer<typeof walletSchema>

export const WALLET_FORM_FIELDS = [
  'displayName',
  'handle',
  'network',
  'profileName',
  'address',
  'secondaryAddress',
  'provider',
  'referralCode',
  'email',
  'ensSuffix',
  'ensLabel',
] as const satisfies ReadonlyArray<keyof WalletValues>

export function walletDefaults(wallet?: Partial<WalletDto> | null, fallback?: Partial<WalletValues>): WalletValues {
  const ens = splitEnsName(wallet?.ensName)
  return {
    displayName: wallet?.displayName ?? fallback?.displayName ?? '',
    handle: wallet?.nickname ?? fallback?.handle ?? '',
    network: wallet?.network ?? fallback?.network ?? '',
    profileName: wallet?.profileName ?? fallback?.profileName ?? '',
    address: wallet?.address ?? fallback?.address ?? '',
    secondaryAddress: wallet?.secondaryAddress ?? fallback?.secondaryAddress ?? '',
    provider: wallet?.provider ?? fallback?.provider ?? '',
    referralCode: wallet?.referralCode ?? fallback?.referralCode ?? '',
    email: wallet?.email ?? fallback?.email ?? '',
    ensSuffix: wallet?.ensName ? ens.suffix : (fallback?.ensSuffix ?? '.eth'),
    ensLabel: wallet?.ensName ? ens.label : (fallback?.ensLabel ?? ''),
  }
}

export function toWalletRequest(values: WalletValues): UpsertWalletRequest {
  return {
    displayName: values.displayName,
    nickname: values.handle,
    network: values.network as NftNetwork,
    profileName: values.profileName,
    address: values.address,
    secondaryAddress: values.secondaryAddress || null,
    provider: values.provider as WalletProvider,
    referralCode: values.referralCode,
    email: values.email,
    ensName: `${values.ensLabel}${values.ensSuffix}`,
  }
}

export function mapWalletApiFields(fields: Record<string, string> | undefined) {
  if (!fields) return undefined
  const { nickname, ensName, ...rest } = fields
  return { ...rest, ...(nickname ? { handle: nickname } : {}), ...(ensName ? { ensLabel: ensName } : {}) }
}
