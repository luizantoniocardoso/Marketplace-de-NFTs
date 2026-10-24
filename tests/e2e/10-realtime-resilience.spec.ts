import type { Page } from '@playwright/test'
import { App, expect, test, USERS } from './support/fixtures'

const EMERALD = { id: 'nft-001', name: 'Emerald Ape #042' }
const ORDER_SETTLE_MS = 3_500

function countCartFetches(page: Page) {
  const counter = { value: 0 }
  page.on('request', (request) => {
    if (request.method() === 'GET' && new URL(request.url()).pathname === '/api/cart') counter.value += 1
  })
  return counter
}

async function storedOrderCount(app: App) {
  const raw = await app.storage('kurio:mock-db')
  return (JSON.parse(raw ?? '{}') as { data?: { orders?: unknown[] } }).data?.orders?.length ?? 0
}

test.describe('tempo real: duplicatas, eventos antigos e reconexão', () => {
  test('ignora eventos duplicados e antigos sem regredir o estado', async ({ app, page }) => {
    await app.addToCart(EMERALD.id, EMERALD.name)
    await app.realtimeConnected()

    await app.mocks((mocks) => mocks.raisePrice('nft-001', 'nft-001-e50', 10))
    await expect(page.getByText(`O preço de ${EMERALD.name} mudou para 1.30 ETH.`)).toBeVisible()
    await app.mocks((mocks) => mocks.raisePrice('nft-001', 'nft-001-e50', 10))
    await expect(page.getByText(`O preço de ${EMERALD.name} mudou para 1.43 ETH.`)).toBeVisible()
    await expect(app.summaryValue('Subtotal')).toHaveText('1.43 ETH')

    const fetches = countCartFetches(page)
    await app.mocks((mocks) => mocks.replayLastEvent())
    await app.mocks((mocks) => mocks.replayLastEvent({ stale: true }))
    await page.waitForTimeout(1_000)

    expect(fetches.value).toBe(0)
    await expect(app.summaryValue('Subtotal')).toHaveText('1.43 ETH')
    await expect(page.getByText(`O preço de ${EMERALD.name} mudou para 1.30 ETH.`)).toHaveCount(0)
  })

  test('queda de conexão com pedido pendente é recuperada sem nova compra', async ({ app, page }) => {
    await app.login()
    await app.addToCart(EMERALD.id, EMERALD.name)
    await app.openCheckout()
    const orderId = await app.placeOrder()
    await expect(app.receiptStatus()).toHaveText('Aguardando a confirmação da rede…')
    await app.realtimeConnected()

    await app.mocks((mocks) => mocks.dropConnections())
    await expect(page.locator('html')).toHaveAttribute('data-realtime', 'disconnected')
    await page.clock.fastForward(ORDER_SETTLE_MS)

    await app.realtimeConnected()
    await expect(app.receiptStatus()).toHaveText('Seus NFTs agora estão na sua carteira')
    expect(page.url()).toContain(orderId)
    expect(await storedOrderCount(app)).toBe(1)
  })

  test('recarregar com pedido pendente retoma o mesmo pedido', async ({ app, page }) => {
    await app.login()
    await app.addToCart(EMERALD.id, EMERALD.name)
    await app.openCheckout()
    const orderId = await app.placeOrder()

    await page.reload()
    await app.mocksReady()
    await expect(app.receiptStatus()).toHaveText(
      /Aguardando a confirmação da rede…|Seus NFTs agora estão na sua carteira/,
    )
    await page.clock.fastForward(ORDER_SETTLE_MS)
    await expect(app.receiptStatus()).toHaveText('Seus NFTs agora estão na sua carteira')

    await page.goBack()
    await expect(page).not.toHaveURL(/\/checkout$/)
    expect(await storedOrderCount(app)).toBe(1)
    expect(page.url()).not.toContain('checkout')
    await app.goto(`/orders/${orderId}`)
    await expect(app.receiptStatus()).toHaveText('Seus NFTs agora estão na sua carteira')
  })

  test('pedido de um usuário não é visível para outro', async ({ app, browser, isMobile }) => {
    await app.login(USERS.nova)
    await app.addToCart(EMERALD.id, EMERALD.name)
    await app.openCheckout()
    const orderId = await app.placeOrder()
    const db = await app.storage('kurio:mock-db')

    const context = await browser.newContext({ ...test.info().project.use, storageState: undefined })
    const other = new App(await context.newPage(), isMobile)
    await other.page.addInitScript((value) => {
      if (sessionStorage.getItem('e2e:db-seeded')) return
      sessionStorage.setItem('e2e:db-seeded', '1')
      localStorage.setItem('kurio:mock-db', value)
    }, db!)
    await other.login(USERS.rafael)
    await other.goto(`/orders/${orderId}`)
    await expect(other.page.getByRole('heading', { level: 1, name: 'Pedido não encontrado' })).toBeVisible()
    await context.close()
  })
})
