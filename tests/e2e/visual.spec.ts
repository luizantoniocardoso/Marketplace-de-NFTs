import type { Page } from '@playwright/test'
import { expect, test } from './support/fixtures'

async function settle(page: Page) {
  await page.waitForLoadState('networkidle')
  await page.evaluate(async () => {
    document.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach((image) => (image.loading = 'eager'))
    for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight / 2) {
      window.scrollTo(0, y)
      await new Promise((resolve) => requestAnimationFrame(resolve))
    }
    window.scrollTo(0, 0)
    await document.fonts.ready
  })
  await page.waitForFunction(() =>
    [...document.images]
      .filter((image) => image.getClientRects().length > 0)
      .every((image) => image.complete && image.naturalWidth > 0),
  )
  await expect(page.locator('[aria-busy="true"]')).toHaveCount(0)
  await expect(page.locator('[data-sonner-toast]')).toHaveCount(0, { timeout: 10_000 })
  await page.waitForLoadState('networkidle')
}

const SCREENSHOT = { fullPage: true, animations: 'disabled', caret: 'hide' } as const

test.describe('regressão visual', () => {
  test('início', async ({ app, page }) => {
    await app.goto('/')
    await expect(page.locator('ul[aria-busy="false"] > li')).toHaveCount(9)
    await settle(page)
    await expect(page).toHaveScreenshot('home.png', SCREENSHOT)
  })

  test('detalhe do NFT', async ({ app, page }) => {
    await app.openNft('nft-001', 'Emerald Ape #042')
    if (!app.isMobile) {
      const related = page.getByRole('region', { name: 'Mais desta coleção' }).first().getByRole('list').first()
      await expect(related.getByRole('listitem')).toHaveCount(10)
      await expect(page.getByRole('group', { name: 'Páginas de Mais desta coleção' })).toBeVisible()
    }
    await settle(page)
    await expect(page).toHaveScreenshot('nft-detail.png', SCREENSHOT)
  })

  test('carrinho', async ({ app, page }) => {
    await app.addToCart('nft-001', 'Emerald Ape #042')
    await app.addToCart('nft-002', 'Sage Nomad #009')
    await expect(app.summaryValue('Total')).toHaveText(/ETH$/)
    await settle(page)
    await expect(page).toHaveScreenshot('cart.png', SCREENSHOT)
  })

  test('pagamento', async ({ app, page }) => {
    await app.login()
    await app.addToCart('nft-001', 'Emerald Ape #042')
    await app.openCheckout()
    await settle(page)
    await expect(page).toHaveScreenshot('checkout.png', SCREENSHOT)
  })
})
