import type { NftNetwork } from './nft'

export const WALLET_PROVIDERS = ['walletconnect', 'metamask', 'coinbase'] as const
export type WalletProvider = (typeof WALLET_PROVIDERS)[number]

export const WALLET_SLOTS = ['primary', 'secondary'] as const
export type WalletSlot = (typeof WALLET_SLOTS)[number]

export interface WalletDto {
  id: string
  slot: WalletSlot
  displayName: string
  nickname: string
  network: NftNetwork
  profileName: string
  address: string
  secondaryAddress: string | null
  provider: WalletProvider
  referralCode: string
  email: string
  ensName: string
  updatedAt: string
}

export type UpsertWalletRequest = Omit<WalletDto, 'id' | 'slot' | 'updatedAt'>

export interface WalletConnectionDto {
  walletId: string
  provider: WalletProvider
  network: NftNetwork
  address: string
  connectedAt: string
}

export interface ConnectWalletRequest {
  walletId: string
  provider: WalletProvider
  network: NftNetwork
}

export const WALLET_PROVIDER_LABELS: Record<WalletProvider, string> = {
  walletconnect: 'WalletConnect',
  metamask: 'MetaMask',
  coinbase: 'Coinbase Wallet',
}

export const WALLET_SLOT_LABELS: Record<WalletSlot, string> = {
  primary: 'Principal',
  secondary: 'Reserva',
}
