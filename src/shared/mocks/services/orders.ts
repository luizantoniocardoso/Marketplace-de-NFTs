import type { CreateOrderRequest, NftNetwork, OrderDto } from '@/shared/contracts'
import { db, type MockOrder } from '../db'
import type { MockUser } from '../fixtures'
import { isScenario, ORDER_SETTLE_DELAY_MS } from '../scenarios'
import { computeQuote, getCart, removePurchased, userOwner } from './cart'
import { updateEditions } from './catalog'
import { randomHex, stableHash, stableStringify } from './crypto'
import { apiError } from './network'
import { emitOrderUpdated } from './realtime'
import { findEdition, findNft, nftImage } from './serializers'

const EXPLORERS: Record<NftNetwork, string> = {
  ethereum: 'https://etherscan.io/tx/',
  polygon: 'https://polygonscan.com/tx/',
  solana: 'https://solscan.io/tx/',
}

const timers = new Map<string, ReturnType<typeof setTimeout>>()

export function toOrderDto(order: MockOrder): OrderDto {
  const { userId: _userId, idempotencyKey: _key, requestHash: _hash, settleAt: _settleAt, outcome: _outcome, ...dto } = order
  return dto
}

export function findUserOrder(userId: string, orderId: string) {
  return db.data.orders.find((order) => order.id === orderId && order.userId === userId)
}

export function requestHash(body: Partial<CreateOrderRequest>) {
  return stableHash(stableStringify(body))
}

function reserveStock(order: MockOrder, direction: 1 | -1) {
  const byNft = new Map<string, Record<string, { availableDelta: number }>>()
  for (const line of order.lines) {
    const patches = byNft.get(line.nftId) ?? {}
    patches[line.editionId] = { availableDelta: -direction * line.quantity }
    byNft.set(line.nftId, patches)
  }
  for (const [nftId, patches] of byNft) updateEditions(nftId, patches)
}

export function settleOrder(orderId: string) {
  const order = db.data.orders.find((item) => item.id === orderId)
  timers.delete(orderId)
  if (!order || order.status !== 'pending') return order
  order.status = order.outcome
  order.version += 1
  order.updatedAt = new Date().toISOString()
  if (order.outcome === 'confirmed') {
    order.transactionHash = `0x${randomHex(64)}`
    order.explorerUrl = `${EXPLORERS[order.network]}${order.transactionHash}`
    removePurchased(order.userId, order.lines)
  } else {
    order.failureReason = 'O pagamento foi recusado pela carteira. Nenhum valor foi cobrado.'
    reserveStock(order, -1)
  }
  db.persist()
  emitOrderUpdated(order)
  return order
}

export function scheduleSettlement(order: MockOrder) {
  if (order.status !== 'pending' || timers.has(order.id)) return
  const wait = Math.max(0, Date.parse(order.settleAt) - Date.now())
  timers.set(order.id, setTimeout(() => settleOrder(order.id), wait))
}

export function settleDueOrder(order: MockOrder) {
  if (order.status === 'pending' && Date.parse(order.settleAt) <= Date.now()) settleOrder(order.id)
  else scheduleSettlement(order)
  return order
}

export function resumePendingOrders() {
  db.data.orders.filter((order) => order.status === 'pending').forEach(settleDueOrder)
}

export function createOrder(user: MockUser, body: Partial<CreateOrderRequest>, idempotencyKey: string) {
  const hash = requestHash(body)
  const previous = db.data.orders.find((order) => order.userId === user.id && order.idempotencyKey === idempotencyKey)
  if (previous) {
    if (previous.requestHash !== hash) {
      return { error: apiError('IDEMPOTENCY_CONFLICT', 'Esta tentativa de compra já foi usada com outros dados.') }
    }
    return { order: settleDueOrder(previous), replayed: true }
  }

  const wallet = db.data.wallets.find((item) => item.id === body.walletId && item.userId === user.id)
  if (!wallet) return { error: apiError('VALIDATION_ERROR', 'Selecione uma carteira cadastrada.', { walletId: 'Selecione uma carteira cadastrada.' }) }
  const connection = db.data.connections[user.id]
  if (!connection || connection.walletId !== wallet.id) {
    return { error: apiError('CONFLICT', 'Conecte a carteira selecionada antes de confirmar a compra.') }
  }

  const cart = getCart(userOwner(user.id))
  const quote = computeQuote(cart)
  if (!quote.lines.length) return { error: apiError('CONFLICT', 'Seu carrinho está vazio.') }
  if (!quote.purchasable) return { error: apiError('OUT_OF_STOCK', quote.issues[0] ?? 'Há itens indisponíveis no carrinho.') }
  if (quote.fingerprint !== body.quoteFingerprint) {
    return { error: apiError('QUOTE_OUTDATED', 'Os valores do pedido mudaram. Revise o resumo e confirme novamente.') }
  }

  const now = new Date()
  const order: MockOrder = {
    id: db.nextId('ord'),
    status: 'pending',
    version: 1,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    lines: quote.lines.map((line) => {
      const nft = findNft(line.nftId)!
      const edition = findEdition(nft, line.editionId)!
      return {
        nftId: nft.id,
        editionId: edition.id,
        editionLabel: edition.label,
        name: nft.name,
        tokenId: nft.tokenId,
        image: nftImage(nft),
        unitPriceEth: line.unitPriceEth,
        quantity: line.quantity,
        lineTotalEth: line.lineTotalEth,
      }
    }),
    couponCode: quote.coupon?.code ?? null,
    subtotalEth: quote.subtotalEth,
    discountEth: quote.discountEth,
    networkFeeEth: quote.networkFeeEth,
    totalEth: quote.totalEth,
    network: body.network ?? wallet.network,
    provider: body.provider ?? wallet.provider,
    walletAddress: wallet.address,
    transactionHash: null,
    explorerUrl: null,
    failureReason: null,
    userId: user.id,
    idempotencyKey,
    requestHash: hash,
    settleAt: new Date(now.getTime() + ORDER_SETTLE_DELAY_MS).toISOString(),
    outcome: isScenario('payment-declined') ? 'declined' : 'confirmed',
  }
  db.data.orders.push(order)
  reserveStock(order, 1)
  db.persist()
  scheduleSettlement(order)
  return { order, replayed: false }
}
