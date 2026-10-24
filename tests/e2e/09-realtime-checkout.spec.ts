import { expect, test } from './support/fixtures'

const EMERALD = { id: 'nft-001', name: 'Emerald Ape #042', edition: 'nft-001-e50' }
const SCENARIO_TRIGGER_MS = 4_500

test.describe('tempo real: preço e disponibilidade durante a compra', () => {
  test('mudança de preço no carrinho aberto é informada e atualiza o resumo', async ({ app, page }) => {
    await app.goto('/')
    await app.setScenario('price-change')
    await app.addToCart(EMERALD.id, EMERALD.name)
    await app.realtimeConnected()
    await expect(app.summaryValue('Subtotal')).toHaveText('1.19 ETH')

    await page.clock.fastForward(SCENARIO_TRIGGER_MS)

    await expect(page.getByText(`O preço de ${EMERALD.name} mudou para 1.30 ETH.`)).toBeVisible()
    await expect(page.getByRole('status').filter({ hasText: 'O preço de alguns itens mudou' })).toBeVisible()
    await expect(app.summaryValue('Subtotal')).toHaveText('1.30 ETH')
    await expect(app.cartLine(EMERALD.name)).toContainText('1.30')

    await page.getByRole('button', { name: 'Entendi' }).click()
    await expect(page.getByRole('status').filter({ hasText: 'O preço de alguns itens mudou' })).toHaveCount(0)
  })

  test('catálogo e detalhe refletem o evento nft.updated', async ({ app, page }) => {
    await app.openNft(EMERALD.id, EMERALD.name)
    await app.realtimeConnected()
    await app.mocks((mocks) => mocks.raisePrice('nft-001', 'nft-001-e50', 100))
    await expect(page.getByText('2.38 ETH').filter({ visible: true }).first()).toBeVisible()

    await app.goto('/')
    await app.realtimeConnected()
    const card = page.locator('ul[aria-busy="false"] > li').filter({ hasText: EMERALD.name })
    await expect(card).toContainText('2.38')
    await app.mocks((mocks) => mocks.setAvailability('nft-001', 'nft-001-e1', 0))
    await app.mocks((mocks) => mocks.raisePrice('nft-001', 'nft-001-e50', 10))
    await expect(card).toContainText('2.61')
  })

  test('checkout exige nova confirmação quando a cotação muda após a revisão', async ({ app, page }) => {
    await app.login()
    await app.addToCart(EMERALD.id, EMERALD.name)
    await app.openCheckout()
    await app.realtimeConnected()

    const dialog = await app.startReview()
    await expect(app.summaryValue('Total', dialog)).toHaveText('1.206 ETH')

    await app.mocks((mocks) => mocks.raisePrice('nft-001', 'nft-001-e50', 10))

    await expect(dialog.getByRole('alert')).toContainText('Os valores mudaram desde a sua revisão')
    await expect(dialog.getByRole('button', { name: 'Confirmar compra' })).toHaveCount(0)
    await expect(app.summaryValue('Total', dialog)).toHaveText('1.316 ETH')

    await dialog.getByRole('button', { name: 'Aceitar novos valores' }).click()
    await dialog.getByRole('button', { name: 'Confirmar compra' }).click()
    await page.waitForURL(/\/orders\/[^/]+$/)
    const receipt = page.getByRole('article', { name: 'Recibo do pedido' })
    await expect(receipt.locator('dl').last().locator('dt:text-is("Total") + dd')).toHaveText('1.316 ETH')
  })

  test('edição esgotada durante o checkout bloqueia a confirmação', async ({ app, page }) => {
    await app.login()
    await app.addToCart(EMERALD.id, EMERALD.name)
    await app.openCheckout()
    await app.realtimeConnected()
    const dialog = await app.startReview()

    await app.mocks((mocks) => mocks.setAvailability('nft-001', 'nft-001-e50', 0))

    await expect(dialog.getByRole('alert')).toBeVisible()
    await expect(dialog.getByRole('button', { name: /Confirmar compra|Aceitar novos valores/ })).toBeDisabled()
    await expect(page).not.toHaveURL(/\/orders\//)
  })
})
