import type { Page, Request } from '@playwright/test'
import { expect, test, type App } from './support/fixtures'

const EMERALD = { id: 'nft-001', name: 'Emerald Ape #042' }
const ORDER_SETTLE_MS = 3_500

interface StoredOrder {
  id: string
  status: string
}

async function storedOrders(app: App) {
  const raw = await app.storage('kurio:mock-db')
  return (JSON.parse(raw ?? '{}') as { data?: { orders?: StoredOrder[] } }).data?.orders ?? []
}

function trackOrderPosts(page: Page) {
  const posts: Request[] = []
  page.on('request', (request) => {
    if (request.method() === 'POST' && new URL(request.url()).pathname === '/api/orders') posts.push(request)
  })
  return posts
}

async function prepareCheckout(app: App) {
  await app.login()
  await app.addToCart(EMERALD.id, EMERALD.name)
  await app.openCheckout()
}

test.describe('falhas e idempotência do pedido', () => {
  test('pagamento recusado preserva os itens no carrinho', async ({ app, page }) => {
    await prepareCheckout(app)
    await app.setScenario('payment-declined')
    await app.placeOrder()

    await expect(app.receiptStatus()).toHaveText('Aguardando a confirmação da rede…')
    await page.clock.fastForward(ORDER_SETTLE_MS)
    await expect(app.receiptStatus()).toHaveText('Pagamento recusado')
    await expect(page.getByText('Seus NFTs agora estão na sua carteira')).toHaveCount(0)
    await expect(page.getByRole('cell').filter({ hasText: 'ID da transação' })).toHaveCount(0)

    await page.reload()
    await app.mocksReady()
    await expect(app.receiptStatus()).toHaveText('Pagamento recusado')

    await app.goto('/cart')
    await expect(app.cartLine(EMERALD.name)).toBeVisible()
    expect((await storedOrders(app)).map((order) => order.status)).toEqual(['declined'])
  })

  test('cliques repetidos na confirmação criam um único pedido', async ({ app, page }) => {
    await prepareCheckout(app)
    const posts = trackOrderPosts(page)
    const dialog = await app.startReview()
    const confirm = dialog.getByRole('button', { name: 'Confirmar compra' })
    await expect(confirm).toBeEnabled()

    await confirm.evaluate((button: HTMLButtonElement) => {
      button.click()
      button.click()
      button.click()
    })
    await page.waitForURL(/\/orders\/[^/]+$/)

    const keys = new Set(posts.map((request) => request.headers()['idempotency-key']))
    expect(keys.size).toBe(1)
    expect(await storedOrders(app)).toHaveLength(1)
  })

  test('timeout após a criação recupera o mesmo pedido pela chave de idempotência', async ({ app, page }) => {
    test.setTimeout(90_000)
    await prepareCheckout(app)
    await app.setScenario('order-timeout')
    const posts = trackOrderPosts(page)

    const orderId = await app.placeOrder()
    expect(posts.length).toBeGreaterThanOrEqual(2)
    const keys = new Set(posts.map((request) => request.headers()['idempotency-key']))
    expect(keys.size).toBe(1)

    const orders = await storedOrders(app)
    expect(orders).toHaveLength(1)
    expect(orders[0].id).toBe(orderId)

    await page.clock.fastForward(ORDER_SETTLE_MS)
    await expect(app.receiptStatus()).toHaveText('Seus NFTs agora estão na sua carteira')
  })
})
