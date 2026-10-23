import { NFT_NETWORKS, WALLET_PROVIDERS, type NftNetwork, type UpsertWalletRequest } from '@/shared/contracts'

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const USERNAME_PATTERN = /^[a-z0-9_.]{3,20}$/
export const ENS_PATTERN = /^[a-z0-9-]+(\.[a-z0-9-]+)*\.eth$/
const EVM_ADDRESS = /^0x[a-fA-F0-9]{40}$/
const SOLANA_ADDRESS = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/

export type FieldErrors = Record<string, string>

export function isAddress(value: string, network: NftNetwork) {
  return network === 'solana' ? SOLANA_ADDRESS.test(value) : EVM_ADDRESS.test(value)
}

export function required(fields: FieldErrors, key: string, value: unknown, message: string) {
  if (typeof value !== 'string' || !value.trim()) fields[key] = message
}

export function validateWallet(body: Partial<UpsertWalletRequest>): FieldErrors {
  const fields: FieldErrors = {}
  required(fields, 'displayName', body.displayName, 'Informe o nome de exibição.')
  required(fields, 'nickname', body.nickname, 'Informe o apelido da carteira.')
  required(fields, 'profileName', body.profileName, 'Informe o nome do perfil.')
  required(fields, 'referralCode', body.referralCode, 'Informe o código de indicação.')
  if (!body.network || !NFT_NETWORKS.includes(body.network)) fields.network = 'Selecione uma rede.'
  if (!body.provider || !WALLET_PROVIDERS.includes(body.provider)) fields.provider = 'Selecione o tipo de carteira.'
  if (!body.address?.trim()) fields.address = 'Informe o endereço da carteira.'
  else if (body.network && !isAddress(body.address.trim(), body.network)) fields.address = 'Endereço inválido para a rede selecionada.'
  if (body.secondaryAddress && !body.secondaryAddress.endsWith('.eth') && body.network && !isAddress(body.secondaryAddress, body.network)) {
    fields.secondaryAddress = 'Informe um ENS ou endereço válido.'
  }
  if (!body.email || !EMAIL_PATTERN.test(body.email)) fields.email = 'Informe um e-mail válido.'
  if (!body.ensName || !ENS_PATTERN.test(body.ensName)) fields.ensName = 'Informe um nome ENS válido.'
  return fields
}
