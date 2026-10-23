import { http, HttpResponse } from 'msw'
import { env } from '@/shared/config'
import type {
  AddCartItemRequest,
  ApplyCouponRequest,
  CartDto,
  QuoteDto,
  UpdateCartItemRequest,
} from '@/shared/contracts'
import {
  apiError,
  cartItemId,
  cartOwner,
  computeQuote,
  findCoupon,
  findEdition,
  findNft,
  getCart,
  isCouponExpired,
  onCartItemAdded,
  readJson,
  simulateNetwork,
  toCartDto,
  touch,
} from '../services'

function cartResponse(owner: string | null) {
  return HttpResponse.json<CartDto>(toCartDto(getCart(owner)))
}

function quantityError(quantity: unknown) {
  return typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 1
}

export const cartHandlers = [
  http.get(`${env.API_URL}/cart`, async ({ request }) => {
    const failure = await simulateNetwork()
    if (failure) return failure
    return cartResponse(cartOwner(request))
  }),

  http.get(`${env.API_URL}/cart/quote`, async ({ request }) => {
    const failure = await simulateNetwork()
    if (failure) return failure
    return HttpResponse.json<QuoteDto>(computeQuote(getCart(cartOwner(request))))
  }),

  http.post(`${env.API_URL}/cart/items`, async ({ request }) => {
    const failure = await simulateNetwork()
    if (failure) return failure
    const owner = cartOwner(request)
    if (!owner) return apiError('VALIDATION_ERROR', 'Carrinho não identificado.')
    const body = await readJson<AddCartItemRequest>(request)
    if (quantityError(body.quantity)) {
      return apiError('VALIDATION_ERROR', 'Quantidade inválida.', { quantity: 'Informe uma quantidade inteira maior que zero.' })
    }
    const nft = body.nftId ? findNft(body.nftId) : undefined
    const edition = nft && body.editionId ? findEdition(nft, body.editionId) : undefined
    if (!nft || !edition) return apiError('NOT_FOUND', 'NFT ou edição não encontrados.')

    const cart = getCart(owner)
    const id = cartItemId(nft.id, edition.id)
    const existing = cart.items.find((item) => item.id === id)
    const quantity = (existing?.quantity ?? 0) + body.quantity!
    if (edition.available === 0) return apiError('OUT_OF_STOCK', `A edição ${edition.label} está esgotada.`)
    if (quantity > Math.min(edition.available, edition.maxPerOrder)) {
      const limit = Math.min(edition.available, edition.maxPerOrder)
      return apiError('OUT_OF_STOCK', `Você pode levar no máximo ${limit} unidade(s) da edição ${edition.label}.`, {
        quantity: `Máximo de ${limit} por pedido.`,
      })
    }
    if (existing) {
      existing.quantity = quantity
      existing.addedPriceEth = edition.priceEth
    } else {
      cart.items.push({ id, nftId: nft.id, editionId: edition.id, quantity, addedPriceEth: edition.priceEth })
    }
    touch(cart)
    onCartItemAdded(nft.id, edition.id)
    return HttpResponse.json<CartDto>(toCartDto(cart), { status: 201 })
  }),

  http.patch(`${env.API_URL}/cart/items/:itemId`, async ({ request, params }) => {
    const failure = await simulateNetwork()
    if (failure) return failure
    const cart = getCart(cartOwner(request))
    const item = cart.items.find((entry) => entry.id === String(params.itemId))
    if (!item) return apiError('NOT_FOUND', 'Item não encontrado no carrinho.')
    const body = await readJson<UpdateCartItemRequest>(request)
    if (quantityError(body.quantity)) {
      return apiError('VALIDATION_ERROR', 'Quantidade inválida.', { quantity: 'Informe uma quantidade inteira maior que zero.' })
    }
    const nft = findNft(item.nftId)
    const edition = nft && findEdition(nft, item.editionId)
    if (!edition) return apiError('NOT_FOUND', 'Edição não encontrada.')
    const limit = Math.min(edition.available, edition.maxPerOrder)
    if (body.quantity! > limit && body.quantity! > item.quantity) {
      return apiError('OUT_OF_STOCK', `Máximo de ${limit} unidade(s) para a edição ${edition.label}.`, {
        quantity: `Máximo de ${limit} por pedido.`,
      })
    }
    item.quantity = body.quantity!
    touch(cart)
    return HttpResponse.json<CartDto>(toCartDto(cart))
  }),

  http.delete(`${env.API_URL}/cart/items/:itemId`, async ({ request, params }) => {
    const failure = await simulateNetwork()
    if (failure) return failure
    const cart = getCart(cartOwner(request))
    const before = cart.items.length
    cart.items = cart.items.filter((item) => item.id !== String(params.itemId))
    if (cart.items.length === before) return apiError('NOT_FOUND', 'Item não encontrado no carrinho.')
    if (!cart.items.length) cart.couponCode = null
    touch(cart)
    return HttpResponse.json<CartDto>(toCartDto(cart))
  }),

  http.post(`${env.API_URL}/cart/acknowledge`, async ({ request }) => {
    const failure = await simulateNetwork()
    if (failure) return failure
    const cart = getCart(cartOwner(request))
    for (const item of cart.items) {
      const nft = findNft(item.nftId)
      const edition = nft && findEdition(nft, item.editionId)
      if (!edition) continue
      item.addedPriceEth = edition.priceEth
      if (edition.available > 0 && item.quantity > edition.available) item.quantity = edition.available
    }
    cart.items = cart.items.filter((item) => {
      const nft = findNft(item.nftId)
      return Boolean(nft && findEdition(nft, item.editionId)?.available)
    })
    touch(cart)
    return HttpResponse.json<CartDto>(toCartDto(cart))
  }),

  http.put(`${env.API_URL}/cart/coupon`, async ({ request }) => {
    const failure = await simulateNetwork()
    if (failure) return failure
    const cart = getCart(cartOwner(request))
    const body = await readJson<ApplyCouponRequest>(request)
    const code = body.code?.trim() ?? ''
    if (!code) return apiError('VALIDATION_ERROR', 'Informe um código promocional.', { code: 'Informe um código promocional.' })
    if (!cart.items.length) return apiError('VALIDATION_ERROR', 'Adicione itens antes de aplicar um cupom.', { code: 'Seu carrinho está vazio.' })
    const coupon = findCoupon(code)
    if (!coupon) return apiError('COUPON_INVALID', 'Código promocional inválido.', { code: 'Código promocional inválido.' })
    if (isCouponExpired(code)) return apiError('COUPON_EXPIRED', 'Este código promocional expirou.', { code: 'Este código promocional expirou.' })
    cart.couponCode = coupon.code
    touch(cart)
    return HttpResponse.json<CartDto>(toCartDto(cart))
  }),

  http.delete(`${env.API_URL}/cart/coupon`, async ({ request }) => {
    const failure = await simulateNetwork()
    if (failure) return failure
    const cart = getCart(cartOwner(request))
    cart.couponCode = null
    touch(cart)
    return HttpResponse.json<CartDto>(toCartDto(cart))
  }),
]
