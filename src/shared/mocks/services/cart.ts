import { API_HEADERS, type CartDto, type CartItemDto, type CartItemStatus, type QuoteDto } from '@/shared/contracts'
import { addEth, compareEth, multiplyEth, parseEth, subtractEth, toEthString } from '@/shared/lib'
import { db, type MockCart } from '../db'
import { COUPONS } from '../fixtures'
import { stableHash, stableStringify } from './crypto'
import { findEdition, findNft, nftImage } from './serializers'
import { optionalUser } from './session'

export const NETWORK_FEE_ETH = '0.016'

export function cartItemId(nftId: string, editionId: string) {
  return `${nftId}~${editionId}`
}

export function guestOwner(request: Request) {
  const cartId = request.headers.get(API_HEADERS.cartId)
  return cartId ? `guest:${cartId}` : null
}

export function userOwner(userId: string) {
  return `user:${userId}`
}

export function cartOwner(request: Request) {
  const user = optionalUser(request)
  return user ? userOwner(user.id) : guestOwner(request)
}

export function getCart(owner: string | null): MockCart {
  if (!owner) return { items: [], couponCode: null, updatedAt: new Date(0).toISOString() }
  db.data.carts[owner] ??= { items: [], couponCode: null, updatedAt: new Date().toISOString() }
  return db.data.carts[owner]
}

export function touch(cart: MockCart) {
  cart.updatedAt = new Date().toISOString()
  db.persist()
}

export function mergeGuestCart(request: Request, userId: string) {
  const owner = guestOwner(request)
  const guest = owner ? db.data.carts[owner] : undefined
  if (!owner || !guest?.items.length) return
  const target = getCart(userOwner(userId))
  for (const item of guest.items) {
    const existing = target.items.find((entry) => entry.id === item.id)
    const edition = findNft(item.nftId) && findEdition(findNft(item.nftId)!, item.editionId)
    const limit = edition ? Math.min(edition.maxPerOrder, Math.max(edition.available, 1)) : item.quantity
    if (existing) existing.quantity = Math.min(existing.quantity + item.quantity, limit)
    else target.items.push({ ...item, quantity: Math.min(item.quantity, limit) })
  }
  target.couponCode ??= guest.couponCode
  delete db.data.carts[owner]
  touch(target)
}

export function findCoupon(code: string | null) {
  return code ? COUPONS.find((coupon) => coupon.code === code.trim().toUpperCase()) : undefined
}

export function isCouponExpired(code: string) {
  const coupon = findCoupon(code)
  return coupon ? Date.parse(coupon.expiresAt) <= Date.now() : false
}

function itemStatus(available: number, quantity: number, priceChanged: boolean): CartItemStatus {
  if (available === 0) return 'unavailable'
  if (quantity > available) return 'quantity_reduced'
  if (priceChanged) return 'price_changed'
  return 'ok'
}

export function toCartItems(cart: MockCart): CartItemDto[] {
  return cart.items.flatMap((item) => {
    const nft = findNft(item.nftId)
    const edition = nft && findEdition(nft, item.editionId)
    if (!nft || !edition) return []
    const priceChanged = compareEth(item.addedPriceEth, edition.priceEth) !== 0
    return [
      {
        id: item.id,
        nftId: nft.id,
        editionId: edition.id,
        editionLabel: edition.label,
        name: nft.name,
        tokenId: nft.tokenId,
        image: nftImage(nft),
        unitPriceEth: edition.priceEth,
        previousUnitPriceEth: priceChanged ? item.addedPriceEth : null,
        quantity: item.quantity,
        available: edition.available,
        maxPerOrder: edition.maxPerOrder,
        lineTotalEth: multiplyEth(edition.priceEth, item.quantity),
        status: itemStatus(edition.available, item.quantity, priceChanged),
      },
    ]
  })
}

export function toCartDto(cart: MockCart): CartDto {
  const coupon = findCoupon(cart.couponCode)
  const items = toCartItems(cart)
  return {
    items,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    coupon: coupon ? { code: coupon.code, description: coupon.description } : null,
    updatedAt: cart.updatedAt,
  }
}

function percentOf(value: string, percent: number) {
  return toEthString((parseEth(value) * BigInt(percent)) / 100n)
}

export function computeQuote(cart: MockCart): QuoteDto {
  const items = toCartItems(cart)
  const coupon = findCoupon(cart.couponCode)
  const validCoupon = coupon && Date.parse(coupon.expiresAt) > Date.now() ? coupon : undefined
  const subtotalEth = items.length ? addEth(...items.map((item) => item.lineTotalEth)) : '0'
  const discountEth = validCoupon ? percentOf(subtotalEth, validCoupon.percentOff) : '0'
  const networkFeeEth = items.length ? NETWORK_FEE_ETH : '0'
  const totalEth = addEth(subtractEth(subtotalEth, discountEth), networkFeeEth)

  const issues = items.flatMap((item) => {
    if (item.status === 'unavailable') return [`${item.name} (${item.editionLabel}) esgotou.`]
    if (item.status === 'quantity_reduced') return [`Restam apenas ${item.available} unidades de ${item.name} (${item.editionLabel}).`]
    if (item.status === 'price_changed') return [`O preço de ${item.name} (${item.editionLabel}) mudou.`]
    return []
  })
  if (coupon && !validCoupon) issues.push(`O cupom ${coupon.code} expirou.`)

  const lines = items.map((item) => ({
    itemId: item.id,
    nftId: item.nftId,
    editionId: item.editionId,
    unitPriceEth: item.unitPriceEth,
    quantity: item.quantity,
    lineTotalEth: item.lineTotalEth,
  }))

  return {
    fingerprint: stableHash(stableStringify({ lines, coupon: validCoupon?.code ?? null, networkFeeEth })),
    lines,
    coupon: validCoupon ? { code: validCoupon.code, description: validCoupon.description } : null,
    subtotalEth,
    discountEth,
    networkFeeEth,
    totalEth,
    purchasable: items.length > 0 && items.every((item) => item.status === 'ok' || item.status === 'price_changed'),
    issues,
    createdAt: new Date().toISOString(),
  }
}

export function removePurchased(userId: string, lines: Array<{ nftId: string; editionId: string; quantity: number }>) {
  const cart = getCart(userOwner(userId))
  for (const line of lines) {
    const item = cart.items.find((entry) => entry.id === cartItemId(line.nftId, line.editionId))
    if (item) item.quantity -= line.quantity
  }
  cart.items = cart.items.filter((item) => item.quantity > 0)
  if (!cart.items.length) cart.couponCode = null
  touch(cart)
}
