import type { Page } from '@playwright/test'
import { formatEth, fromWei, toWei } from './support/eth'
import { expect, test, USERS, type App } from './support/fixtures'

const EMERALD = { id: 'nft-001', name: 'Emerald Ape #042', price: '1.19' }
const SAGE = { id: 'nft-002', name: 'Sage Nomad #009', price: '1.69' }
const NETWORK_FEE = '0.016'

interface QuoteBody {
  subtotalEth: string
  discountEth: string
  networkFeeEth: string
  totalEth: string
}

async function waitForQuote(page: Page, matches: (quote: QuoteBody) => boolean) {
  const response = await page.waitForResponse(async (res) => {
    if (new URL(res.url()).pathname !== '/api/cart/quote' || res.status() !== 200) return false
    return matches((await res.json()) as QuoteBody)
  })
  return (await response.json()) as QuoteBody
}

async function expectSummary(app: App, quote: QuoteBody) {
  await expect(app.summaryValue('Subtotal')).toHaveText(formatEth(quote.subtotalEth))
  await expect(app.summaryValue('Desconto do lançamento')).toHaveText(
    `(-) ${formatEth(quote.discountEth, { unit: false })}`,
  )
  await expect(app.summaryValue('Taxa de rede')).toHaveText(formatEth(quote.networkFeeEth))
  await expect(app.summaryValue('Total')).toHaveText(formatEth(quote.totalEth))
}

function quantityOf(app: App, name: string) {
  return app.cartLine(name).getByRole('group', { name: `Quantidade de ${name}` })
}

async function applyCoupon(app: App, code: string) {
  const summary = app.cartSummary()
  await summary.getByRole('textbox', { name: 'Código promocional' }).fill(code)
  await summary.getByRole('button', { name: 'Aplicar' }).click()
}

test.describe('carrinho', () => {
  test('altera quantidades, remove itens e mantém o resumo coerente com a API', async ({ app, page }) => {
    await app.addToCart(EMERALD.id, EMERALD.name)
    await app.addToCart(SAGE.id, SAGE.name)

    const afterIncrease = waitForQuote(
      page,
      (quote) => quote.subtotalEth === fromWei(toWei(EMERALD.price) + 2n * toWei(SAGE.price)),
    )
    await quantityOf(app, SAGE.name)
      .getByRole('button', { name: `Aumentar quantidade de ${SAGE.name.toLowerCase()}` })
      .click()
    await expect(quantityOf(app, SAGE.name).locator('output')).toHaveText('2')
    let quote = await afterIncrease

    const subtotal = toWei(EMERALD.price) + 2n * toWei(SAGE.price)
    expect(quote.subtotalEth).toBe(fromWei(subtotal))
    expect(quote.networkFeeEth).toBe(NETWORK_FEE)
    expect(quote.totalEth).toBe(fromWei(subtotal + toWei(NETWORK_FEE)))
    await expectSummary(app, quote)

    const afterRemoval = waitForQuote(page, (quote) => quote.subtotalEth === fromWei(2n * toWei(SAGE.price)))
    await app
      .cartLine(EMERALD.name)
      .getByRole('button', { name: `Remover ${EMERALD.name} (1/50) do carrinho` })
      .click()
    await expect(app.cartLine(EMERALD.name)).toHaveCount(0)
    quote = await afterRemoval
    expect(quote.subtotalEth).toBe(fromWei(2n * toWei(SAGE.price)))
    await expectSummary(app, quote)

    await page.reload()
    await app.mocksReady()
    await expect(app.cartLine(EMERALD.name)).toHaveCount(0)
    await expect(quantityOf(app, SAGE.name).locator('output')).toHaveText('2')
  })

  test('quantidade respeita a disponibilidade da edição', async ({ app, page }) => {
    await app.addToCart(EMERALD.id, EMERALD.name)
    await app.mocks((mocks) => mocks.setAvailability('nft-001', 'nft-001-e50', 2))
    await page.reload()
    await app.mocksReady()

    const stepper = quantityOf(app, EMERALD.name)
    const increase = stepper.getByRole('button', { name: `Aumentar quantidade de ${EMERALD.name.toLowerCase()}` })
    await increase.click()
    await expect(stepper.locator('output')).toHaveText('2')
    await expect(increase).toBeDisabled()
  })

  test('cupom inválido, expirado, válido e remoção do cupom', async ({ app, page }) => {
    await app.addToCart(EMERALD.id, EMERALD.name)
    const summary = app.cartSummary()
    const field = summary.getByRole('textbox', { name: 'Código promocional' })

    await applyCoupon(app, 'NAOEXISTE')
    await expect(field).toHaveAccessibleDescription('Código promocional inválido.')
    await expect(field).toHaveAttribute('aria-invalid', 'true')

    await applyCoupon(app, 'EXPIRADO')
    await expect(field).toHaveAccessibleDescription('Este código promocional expirou.')

    const withCoupon = waitForQuote(page, (quote) => quote.discountEth !== '0')
    await applyCoupon(app, 'KURIO10')
    await expect(summary.getByText('10% de desconto no lançamento').first()).toBeVisible()
    const quote = await withCoupon
    const discount = toWei(EMERALD.price) / 10n
    expect(quote.discountEth).toBe(fromWei(discount))
    expect(quote.totalEth).toBe(fromWei(toWei(EMERALD.price) - discount + toWei(NETWORK_FEE)))
    await expectSummary(app, quote)

    await page.reload()
    await app.mocksReady()
    await expect(summary.getByText('10% de desconto no lançamento').first()).toBeVisible()

    await summary.getByRole('button', { name: 'Remover cupom KURIO10' }).click()
    await expect(summary.getByText('10% de desconto no lançamento')).toHaveCount(0)
    await expect(app.summaryValue('Desconto do lançamento')).toHaveText('(-) 0.00')
  })

  test('carrinho do visitante sobrevive ao refresh e é preservado ao autenticar', async ({ app, page }) => {
    await app.addToCart(SAGE.id, SAGE.name)
    await page.reload()
    await app.mocksReady()
    await expect(app.cartLine(SAGE.name)).toBeVisible()

    await app.goto('/login?redirect=%2Fcart')
    await app.fillLogin(USERS.nova)
    await expect(page).toHaveURL(/\/cart$/)
    await expect(app.cartLine(SAGE.name)).toBeVisible()

    await page.reload()
    await app.mocksReady()
    await expect(app.cartLine(SAGE.name)).toBeVisible()
  })
})
