import { z } from 'zod/mini'
import { ENS_SUFFIXES, NFT_NETWORKS, type EnsSuffix, type NftNetwork } from '@/shared/contracts'

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const USERNAME_PATTERN = /^[a-z0-9_.]{3,20}$/
const ENS_LABEL_PATTERN = /^[a-z0-9-]{2,32}$/
const ENS_NAME_PATTERN = /^[a-z0-9-]+(\.[a-z0-9-]+)*\.eth$/
const EVM_ADDRESS = /^0x[a-fA-F0-9]{40}$/
const SOLANA_ADDRESS = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/

export const MIN_PASSWORD_LENGTH = 8

export const VALIDATION_MESSAGES = {
  emailRequired: 'Informe seu e-mail.',
  emailInvalid: 'Informe um e-mail válido.',
  usernameInvalid: 'Use de 3 a 20 letras minúsculas, números, ponto ou _.',
  passwordRequired: 'Informe sua senha.',
  passwordTooShort: `A senha precisa ter ao menos ${MIN_PASSWORD_LENGTH} caracteres.`,
  ensLabelInvalid: 'Use de 2 a 32 letras minúsculas, números ou hífen.',
  ensNameInvalid: 'Informe um nome ENS válido.',
  networkRequired: 'Selecione uma rede.',
  providerRequired: 'Selecione o tipo de carteira.',
  displayNameRequired: 'Informe o nome de exibição.',
  walletNicknameRequired: 'Informe o apelido da carteira.',
  profileNameRequired: 'Informe o nome do perfil.',
  addressRequired: 'Informe o endereço da carteira.',
  addressInvalid: 'Endereço inválido para a rede selecionada.',
  referralCodeRequired: 'Informe o código de indicação.',
  secondaryAddressInvalid: 'Informe um ENS ou endereço válido.',
  couponRequired: 'Informe um código promocional.',
} as const

export function isWalletAddress(value: string, network: NftNetwork) {
  return network === 'solana' ? SOLANA_ADDRESS.test(value) : EVM_ADDRESS.test(value)
}

export function isEnsName(value: string) {
  return ENS_NAME_PATTERN.test(value)
}

export function splitEnsName(ensName: string | null | undefined): { label: string; suffix: EnsSuffix } {
  const suffix = [...ENS_SUFFIXES].sort((a, b) => b.length - a.length).find((item) => ensName?.endsWith(item)) ?? '.eth'
  return { label: ensName ? ensName.slice(0, -suffix.length) : '', suffix }
}

export const rules = {
  required: (message: string) => z.string().check(z.trim(), z.minLength(1, { error: message })),
  email: () =>
    z
      .string()
      .check(
        z.trim(),
        z.minLength(1, { error: VALIDATION_MESSAGES.emailRequired }),
        z.regex(EMAIL_PATTERN, { error: VALIDATION_MESSAGES.emailInvalid }),
      ),
  username: () =>
    z
      .string()
      .check(z.trim(), z.toLowerCase(), z.regex(USERNAME_PATTERN, { error: VALIDATION_MESSAGES.usernameInvalid })),
  newPassword: () =>
    z.string().check(z.minLength(MIN_PASSWORD_LENGTH, { error: VALIDATION_MESSAGES.passwordTooShort })),
  ensLabel: () =>
    z
      .string()
      .check(z.trim(), z.toLowerCase(), z.regex(ENS_LABEL_PATTERN, { error: VALIDATION_MESSAGES.ensLabelInvalid })),
  ensSuffix: () => z.enum(ENS_SUFFIXES),
  network: () => z.enum(NFT_NETWORKS, { error: VALIDATION_MESSAGES.networkRequired }),
}
