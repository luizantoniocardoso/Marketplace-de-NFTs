import { NFT_NETWORKS, WALLET_PROVIDERS, type UpsertWalletRequest } from '@/shared/contracts'
import { EMAIL_PATTERN, isEnsName, isWalletAddress, VALIDATION_MESSAGES as MESSAGES } from '@/shared/lib'

export type FieldErrors = Record<string, string>

export function required(fields: FieldErrors, key: string, value: unknown, message: string) {
  if (typeof value !== 'string' || !value.trim()) fields[key] = message
}

export function validateWallet(body: Partial<UpsertWalletRequest>): FieldErrors {
  const fields: FieldErrors = {}
  required(fields, 'displayName', body.displayName, MESSAGES.displayNameRequired)
  required(fields, 'nickname', body.nickname, MESSAGES.walletNicknameRequired)
  required(fields, 'profileName', body.profileName, MESSAGES.profileNameRequired)
  required(fields, 'referralCode', body.referralCode, MESSAGES.referralCodeRequired)
  if (!body.network || !NFT_NETWORKS.includes(body.network)) fields.network = MESSAGES.networkRequired
  if (!body.provider || !WALLET_PROVIDERS.includes(body.provider)) fields.provider = MESSAGES.providerRequired
  if (!body.address?.trim()) fields.address = MESSAGES.addressRequired
  else if (body.network && !isWalletAddress(body.address.trim(), body.network)) fields.address = MESSAGES.addressInvalid
  if (
    body.secondaryAddress &&
    !body.secondaryAddress.endsWith('.eth') &&
    body.network &&
    !isWalletAddress(body.secondaryAddress, body.network)
  ) {
    fields.secondaryAddress = MESSAGES.secondaryAddressInvalid
  }
  if (!body.email || !EMAIL_PATTERN.test(body.email)) fields.email = MESSAGES.emailInvalid
  if (!body.ensName || !isEnsName(body.ensName)) fields.ensName = MESSAGES.ensNameInvalid
  return fields
}
