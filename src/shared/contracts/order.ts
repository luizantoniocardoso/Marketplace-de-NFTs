import type { NftImageDto, NftNetwork } from './nft'
import type { WalletProvider } from './wallet'

export const ORDER_STATUSES = ['pending', 'confirmed', 'declined'] as const
export type OrderStatus = (typeof ORDER_STATUSES)[number]

export interface OrderLineDto {
  nftId: string
  editionId: string
  editionLabel: string
  name: string
  tokenId: string
  image: NftImageDto
  unitPriceEth: string
  quantity: number
  lineTotalEth: string
}

export interface CollectorDto {
  displayName: string
  username: string
  profileName: string
  email: string
  ensName: string
  referralCode: string
  address: string
  secondaryAddress: string | null
}

export interface OrderDto {
  id: string
  status: OrderStatus
  version: number
  createdAt: string
  updatedAt: string
  lines: OrderLineDto[]
  couponCode: string | null
  subtotalEth: string
  discountEth: string
  networkFeeEth: string
  totalEth: string
  network: NftNetwork
  provider: WalletProvider
  walletAddress: string
  transactionHash: string | null
  explorerUrl: string | null
  failureReason: string | null
}

export interface CreateOrderRequest {
  quoteFingerprint: string
  walletId: string
  provider: WalletProvider
  network: NftNetwork
  collector: CollectorDto
  note: string | null
}
