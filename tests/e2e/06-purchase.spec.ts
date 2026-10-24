import { formatEth, fromWei, toWei } from './support/eth'
import { expect, test, USERS } from './support/fixtures'

const EMERALD = { id: 'nft-001', name: 'Emerald Ape #042', price: '1.19' }
const SAGE = { id: 'nft-002', name: 'Sage Nomad #009', price: '1.69' }
const ORDER_SETTLE_MS = 3_500

test.describe('compra completa', () => {
  test('do catálogo ao recibo confirmado, com snapshot imutável do pedido', async ({ app, page }) => {
    await app.goto('/')
    await page.locator('ul[aria-busy="false"]').first().getByRole('link', { name: EMERALD.name }).first().click()
    await expect(page.getByRole('heading', { level: 1, name: EMERALD.name })).toBeVisible()
    await page.getByRole('group', { name: 'Quantidade' }).getByRole('button', { name: 'Aumentar quantidade' }).click()
    await app.buyButton().click()
    await page.waitForURL('**/cart')
    await app.addToCart(SAGE.id, SAGE.name)

    const summary = app.cartSummary()
    await summary.getByRole('textbox', { name: 'Código promocional' }).fill('GENESIS5')
    await summary.getByRole('button', { name: 'Aplicar' }).click()
    await expect(summary.getByText('5% de desconto para colecionadores gênesis')).toBeVisible()
    await summary.getByRole('button', { name: 'Conectar e finalizar' }).click()

    await expect(page).toHaveURL(/\/login\?redirect=%2Fcheckout/)
    await app.fillLogin(USERS.nova)
    await expect(page).toHaveURL(/\/checkout$/)
    await expect(page.getByRole('button', { name: 'Confirmar compra' }).first()).toBeEnabled()

    const subtotal = 2n * toWei(EMERALD.price) + toWei(SAGE.price)
    const discount = (subtotal * 5n) / 100n
    const total = fromWei(subtotal - discount + toWei('0.016'))

    const dialog = await app.startReview()
    await expect(app.summaryValue('Total', dialog)).toHaveText(formatEth(total))
    await expect(dialog.getByText('Pagamento com MetaMask na rede Ethereum')).toBeVisible()
    await dialog.getByRole('button', { name: 'Confirmar compra' }).click()

    await page.waitForURL(/\/orders\/[^/]+$/)
    const orderId = page.url().split('/orders/')[1]
    await expect(app.receiptStatus()).toHaveText('Aguardando a confirmação da rede…')
    await expect(page.getByText('o pedido não será criado de novo')).toBeVisible()
    await expect(page.getByRole('link', { name: /Ver no/ })).toHaveCount(0)

    await page.clock.fastForward(ORDER_SETTLE_MS)
    await expect(app.receiptStatus()).toHaveText('Seus NFTs agora estão na sua carteira')

    const receipt = page.getByRole('article', { name: 'Recibo do pedido' })
    await expect(receipt.locator('dt:text-is("ID da transação") + dd')).toHaveText(/^0x[0-9a-fA-F]+…[0-9a-fA-F]+$/)
    const lines = receipt.getByRole('table', { name: 'Itens comprados' })
    await expect(lines.getByRole('row').filter({ hasText: EMERALD.name })).toContainText('(x 2)')
    await expect(lines.getByRole('row').filter({ hasText: SAGE.name })).toContainText('(x 1)')
    await expect(receipt.getByText('Desconto (GENESIS5)')).toBeVisible()
    await expect(receipt.locator('dl').last().locator('dt:text-is("Total") + dd')).toHaveText(formatEth(total))
    await expect(receipt.getByRole('link', { name: /Ver no Etherscan/ })).toHaveAttribute('href', /^https:\/\//)

    await app.goto('/cart')
    await expect(page.getByText('Seu carrinho está vazio')).toBeVisible()

    await app.mocks((mocks) => mocks.raisePrice('nft-001', 'nft-001-e50', 50))
    await app.goto(`/orders/${orderId}`)
    await expect(app.receiptStatus()).toHaveText('Seus NFTs agora estão na sua carteira')
    await expect(receipt.locator('dl').last().locator('dt:text-is("Total") + dd')).toHaveText(formatEth(total))
  })

  test('após a confirmação, remove do carrinho apenas o que foi comprado', async ({ app, page }) => {
    await app.login()
    await app.addToCart(EMERALD.id, EMERALD.name)
    await app.openCheckout()
    await app.placeOrder()

    await app.addToCart(SAGE.id, SAGE.name)
    await page.clock.fastForward(ORDER_SETTLE_MS)
    await app.goto('/cart')
    await expect(app.cartLine(SAGE.name)).toBeVisible()
    await expect(app.cartLine(EMERALD.name)).toHaveCount(0)
  })

  test('acesso direto a um pedido inexistente', async ({ app, page }) => {
    await app.login()
    await app.goto('/orders/ord-inexistente')
    await expect(page.getByRole('heading', { level: 1, name: 'Pedido não encontrado' })).toBeVisible()
  })
})
