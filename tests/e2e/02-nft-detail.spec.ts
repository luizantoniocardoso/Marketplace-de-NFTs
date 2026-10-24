import { expect, test } from './support/fixtures'

interface EditionBody {
  id: string
  label: string
  available: number
  maxPerOrder: number
}

test.describe('detalhe do NFT', () => {
  test('acesso direto exibe galeria, informações e edições', async ({ app, page }) => {
    await app.openNft('nft-001', 'Emerald Ape #042')
    await expect(page).toHaveTitle(/Emerald Ape #042/)
    await expect(page.getByRole('img', { name: /Macaco|macaco|Emerald/ }).first()).toBeVisible()
    const editions = page.getByRole('group', { name: 'Edição:' })
    await expect(editions.getByRole('button', { name: '1/50' })).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByRole('button', { name: /Adicionar Emerald Ape #042 aos favoritos/ }).first()).toBeVisible()
  })

  test('NFT inexistente mostra estado de não encontrado', async ({ app, page }) => {
    await app.goto('/nft/nft-999')
    await expect(page.getByRole('heading', { level: 1, name: 'NFT não encontrado' })).toBeVisible()
    await page.getByRole('link', { name: 'Voltar ao catálogo' }).click()
    await expect(page).toHaveURL(/\/$/)
  })

  test('edição esgotada fica indisponível para compra', async ({ app, page }) => {
    await app.goto('/')
    await app.mocks((mocks) => mocks.setAvailability('nft-001', 'nft-001-e10', 0))
    await app.openNft('nft-001', 'Emerald Ape #042')

    const soldOut = page.getByRole('group', { name: 'Edição:' }).getByRole('button', { name: '1/10 (esgotada)' })
    await expect(soldOut).toBeDisabled()

    await app.mocks((mocks) => mocks.setAvailability('nft-001', 'nft-001-e50', 0))
    await expect(
      page.getByRole('group', { name: 'Edição:' }).getByRole('button', { name: '1/50 (esgotada)' }),
    ).toBeDisabled()
    await expect(
      app.isMobile ? page.getByRole('button', { name: 'Esgotado' }) : page.getByRole('button', { name: 'ESGOTADO' }),
    ).toBeDisabled()
  })

  test('quantidade respeita o limite por pedido e o estoque da edição', async ({ app, page }) => {
    await app.openNft('nft-001', 'Emerald Ape #042')
    const detail = (await page.evaluate(() => fetch('/api/nfts/nft-001').then((res) => res.json()))) as {
      editions: EditionBody[]
    }
    const edition =
      detail.editions.find((item) => item.label === '1/10' && item.available > 0) ??
      detail.editions.find((item) => item.label === '1/50')!
    const max = Math.min(edition.maxPerOrder, edition.available)

    await page.getByRole('group', { name: 'Edição:' }).getByRole('button', { name: edition.label, exact: true }).click()
    const stepper = page.getByRole('group', { name: 'Quantidade' })
    const increase = stepper.getByRole('button', { name: 'Aumentar quantidade' })
    for (let clicks = 1; clicks < max; clicks += 1) await increase.click()

    await expect(stepper.locator('output')).toHaveText(String(max))
    await expect(increase).toBeDisabled()
    if (!app.isMobile) await expect(page.getByText(`Máximo de ${max} por pedido nesta edição.`)).toBeVisible()
  })

  test('comprar leva ao carrinho com edição e quantidade escolhidas', async ({ app, page }) => {
    await app.openNft('nft-002', 'Sage Nomad #009')
    await page.getByRole('group', { name: 'Quantidade' }).getByRole('button', { name: 'Aumentar quantidade' }).click()
    await app.buyButton().click()
    await page.waitForURL('**/cart')
    const line = app.cartLine('Sage Nomad #009')
    await expect(line).toContainText('1/50')
    await expect(line.getByRole('group', { name: /Quantidade/ }).locator('output')).toHaveText('2')
  })
})
