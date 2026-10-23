import type { NftImageDto } from './nft'

export type CartItemStatus = 'ok' | 'price_changed' | 'quantity_reduced' | 'unavailable'

export interface CartItemDto {
  id: string
  nftId: string
  editionId: string
  editionLabel: string
  name: string
  tokenId: string
  image: NftImageDto
  unitPriceEth: string
  previousUnitPriceEth: string | null
  quantity: number
  available: number
  maxPerOrder: number
  lineTotalEth: string
  status: CartItemStatus
}

export interface CouponDto {
  code: string
  description: string
}

export interface CartDto {
  items: CartItemDto[]
  itemCount: number
  coupon: CouponDto | null
  updatedAt: string
}

export interface AddCartItemRequest {
  nftId: string
  editionId: string
  quantity: number
}

export interface UpdateCartItemRequest {
  quantity: number
}

export interface ApplyCouponRequest {
  code: string
}

export interface QuoteLineDto {
  itemId: string
  nftId: string
  editionId: string
  unitPriceEth: string
  quantity: number
  lineTotalEth: string
}

export interface QuoteDto {
  fingerprint: string
  lines: QuoteLineDto[]
  coupon: CouponDto | null
  subtotalEth: string
  discountEth: string
  networkFeeEth: string
  totalEth: string
  purchasable: boolean
  issues: string[]
  createdAt: string
}
