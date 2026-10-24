import { expect, test, type App } from './support/fixtures'

const RETRY_BACKOFF = '00:15'

async function skipRetries(app: App) {
  for (let attempt = 0; attempt < 4; attempt += 1) await app.page.clock.fastForward(RETRY_BACKOFF)
}

test.describe('carregamento lento, falhas e recuperação', () => {
  test('skeletons com shimmer no catálogo preservam as dimensões do conteúdo', async ({ app, page }) => {
    await app.useScenario('slow')
    await app.goto('/')

    const grid = page.locator('ul[aria-busy]').first()
    await expect(grid).toHaveAttribute('aria-busy', 'true')
    await expect(page.getByRole('status').filter({ hasText: 'Carregando NFTs' })).toBeAttached()
    const skeleton = grid.locator('[data-slot="skeleton"]').first()
    await expect(skeleton).toBeVisible()
    expect(await skeleton.evaluate((element) => getComputedStyle(element).animationName)).toMatch(/shimmer/)
    const skeletonBox = await grid.locator(':scope > li').first().boundingBox()

    await expect(grid).toHaveAttribute('aria-busy', 'false', { timeout: 20_000 })
    const cardBox = await grid.locator(':scope > li').first().boundingBox()
    expect(Math.abs(cardBox!.width - skeletonBox!.width)).toBeLessThan(2)
    expect(Math.abs(cardBox!.height - skeletonBox!.height) / cardBox!.height).toBeLessThan(0.1)
  })

  test('skeleton respeita a preferência por movimento reduzido', async ({ app, page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await app.useScenario('slow')
    await app.goto('/')
    const skeleton = page.locator('ul[aria-busy="true"] [data-slot="skeleton"]').first()
    await expect(skeleton).toBeVisible()
    expect(await skeleton.evaluate((element) => getComputedStyle(element).animationName)).toBe('none')
  })

  test('skeletons no detalhe e no resumo do carrinho durante lentidão', async ({ app, page }) => {
    await app.addToCart('nft-001', 'Emerald Ape #042')
    await app.setScenario('slow')

    await page.reload()
    await app.mocksReady()
    const summary = app.cartSummary()
    await expect(summary.locator('dl[aria-busy="true"] [data-slot="skeleton"]').first()).toBeVisible()
    await expect(app.summaryValue('Total')).toHaveText(/ETH$/, { timeout: 20_000 })

    await app.goto('/nft/nft-002')
    await expect(page.getByRole('status').filter({ hasText: 'Carregando NFT' })).toBeAttached()
    await expect(
      page.locator('[aria-busy="true"] [data-slot="skeleton"]').filter({ visible: true }).first(),
    ).toBeVisible()
    await expect(page.getByRole('heading', { level: 1, name: 'Sage Nomad #009' })).toBeVisible({ timeout: 20_000 })
  })

  test('falha HTTP 500 no catálogo mostra erro e recupera ao tentar novamente', async ({ app, page }) => {
    await app.useScenario('server-error')
    await app.goto('/')
    await skipRetries(app)

    const error = page.getByRole('alert').filter({ hasText: 'Não foi possível carregar o catálogo' })
    await expect(error).toBeVisible()
    await expect(error).toContainText('O servidor falhou ao processar a requisição.')

    await app.setScenario('default')
    await error.getByRole('button', { name: 'Tentar novamente' }).click()
    await expect(error).toBeHidden()
    await expect(page.locator('ul[aria-busy="false"] > li')).toHaveCount(9)
  })

  test('falha de conexão no detalhe e no carrinho com nova tentativa', async ({ app, page }) => {
    await app.goto('/')
    await app.setScenario('offline')

    await app.goto('/nft/nft-001')
    await skipRetries(app)
    const detailError = page.getByRole('alert').filter({ hasText: 'Não foi possível carregar este NFT' })
    await expect(detailError).toBeVisible()
    await app.setScenario('default')
    await detailError.getByRole('button', { name: 'Tentar novamente' }).click()
    await expect(page.getByRole('heading', { level: 1, name: 'Emerald Ape #042' })).toBeVisible()

    await app.setScenario('offline')
    await app.goto('/cart')
    await skipRetries(app)
    const cartError = page.getByRole('alert').filter({ hasText: 'Não foi possível carregar o carrinho' })
    await expect(cartError).toBeVisible()
    await app.setScenario('default')
    await cartError.getByRole('button', { name: 'Tentar novamente' }).click()
    await expect(page.getByText('Seu carrinho está vazio')).toBeVisible()
  })

  test('respostas fora de ordem não sobrescrevem a consulta mais recente', async ({ app, page }) => {
    await app.useScenario('variable-latency')
    await app.goto('/')
    await expect(page.locator('ul[aria-busy="false"] > li')).toHaveCount(9, { timeout: 20_000 })

    for (const page_ of ['2', '3', '4']) {
      await page.getByRole('button', { name: `Página ${page_}` }).click()
    }
    await expect(page).toHaveURL(/page=4/)
    await expect(page.getByRole('button', { name: 'Página 4' })).toHaveAttribute('aria-current', 'page')

    const expected = (await page.evaluate(async () => {
      const response = await fetch('/api/nfts?sort=recent&tab=all&page=4&pageSize=9')
      return response.json()
    })) as { items: { name: string }[] }
    const grid = page.locator('ul[aria-busy="false"]').first()
    await expect(grid.locator(':scope > li')).toHaveCount(expected.items.length, { timeout: 20_000 })
    for (const item of expected.items) {
      await expect(grid.getByRole('link', { name: item.name }).first()).toBeVisible()
    }
  })
})
