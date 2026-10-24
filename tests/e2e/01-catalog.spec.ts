import type { Page, Response } from '@playwright/test'
import { expect, test, type App } from './support/fixtures'

interface NftListBody {
  items: { id: string; name: string; priceEth: string }[]
  total: number
  page: number
  totalPages: number
}

function isCatalogResponse(response: Response) {
  return new URL(response.url()).pathname === '/api/nfts' && response.request().method() === 'GET'
}

async function catalogResponse(
  page: Page,
  action: () => Promise<unknown>,
  matches: (params: URLSearchParams) => boolean,
) {
  const [response] = await Promise.all([
    page.waitForResponse((res) => isCatalogResponse(res) && matches(new URL(res.url()).searchParams)),
    action(),
  ])
  return { params: new URL(response.url()).searchParams, body: (await response.json()) as NftListBody }
}

const grid = (app: App) => app.page.locator('ul[aria-busy="false"]').first()

async function expectGridToShow(app: App, body: NftListBody) {
  await expect(grid(app).locator(':scope > li')).toHaveCount(body.items.length)
  for (const item of body.items) {
    await expect(grid(app).getByRole('link', { name: item.name }).first()).toBeVisible()
  }
}

async function search(app: App, term: string) {
  if (!app.isMobile) await app.page.getByRole('button', { name: 'Abrir busca' }).click()
  const field = app.page.getByRole('searchbox', { name: 'Buscar NFTs' }).first()
  await field.fill(term)
  await field.press('Enter')
}

async function withFilters(app: App, apply: (scope: ReturnType<Page['getByRole']>) => Promise<void>) {
  if (!app.isMobile) {
    await apply(app.page.getByRole('complementary', { name: 'Filtros do catálogo' }))
    return
  }
  await app.page.getByRole('button', { name: /^Filtros/ }).click()
  const sheet = app.page.getByRole('dialog', { name: 'Filtros' })
  await apply(sheet)
  await sheet.getByRole('button', { name: /^Ver .*resultados$/ }).click()
  await expect(sheet).toBeHidden()
}

async function chooseSort(app: App, label: string) {
  if (app.isMobile) {
    await app.page.getByRole('button', { name: /^Filtros/ }).click()
    const sheet = app.page.getByRole('dialog', { name: 'Filtros' })
    await sheet.getByRole('combobox', { name: 'Ordenar por:' }).click()
    await app.page.getByRole('option', { name: label }).click()
    await sheet.getByRole('button', { name: /^Ver .*resultados$/ }).click()
    return
  }
  await app.page.getByRole('combobox', { name: 'Ordenar por:' }).click()
  await app.page.getByRole('option', { name: label }).click()
}

test.describe('catálogo: busca, filtros, ordenação e paginação', () => {
  test('busca compõe a URL e envia o termo para a API', async ({ app, page }) => {
    await app.goto('/')
    await expect(grid(app).locator(':scope > li')).toHaveCount(9)

    const { params, body } = await catalogResponse(
      page,
      () => search(app, 'nomad'),
      (params) => params.get('q') === 'nomad',
    )
    expect(params.get('q')).toBe('nomad')
    await expect(page).toHaveURL(/[?&]q=nomad/)
    expect(body.items.length).toBeGreaterThan(0)
    expect(body.items.every((item) => /nomad/i.test(item.name))).toBe(true)
    await expectGridToShow(app, body)
  })

  test('filtros combinados, ordenação e reinício da paginação', async ({ app, page }) => {
    await app.goto('/?page=2')
    await expect(page.getByRole('button', { name: 'Página 2' })).toHaveAttribute('aria-current', 'page')

    const music = await catalogResponse(
      page,
      () => withFilters(app, (scope) => scope.getByRole('button', { name: /^Música/ }).click()),
      (params) => params.has('collections'),
    )
    expect(music.params.getAll('collections')).toEqual(['musica'])
    expect(music.params.get('page')).toBe('1')
    await expect(page).not.toHaveURL(/[?&]page=/)

    const combined = await catalogResponse(
      page,
      () => withFilters(app, (scope) => scope.getByRole('button', { name: /^Ethereum/ }).click()),
      (params) => params.has('networks'),
    )
    expect(combined.params.getAll('collections')).toEqual(['musica'])
    expect(combined.params.getAll('networks')).toEqual(['ethereum'])
    expect(combined.body.total).toBeLessThan(music.body.total)
    await expect(page).toHaveURL(/collections/)
    await expect(page).toHaveURL(/networks/)
    await expectGridToShow(app, combined.body)

    const sorted = await catalogResponse(
      page,
      () => chooseSort(app, 'Menor preço'),
      (params) => params.get('sort') === 'price-asc',
    )
    expect(sorted.params.get('sort')).toBe('price-asc')
    const prices = sorted.body.items.map((item) => Number(item.priceEth))
    expect(prices).toEqual([...prices].sort((a, b) => a - b))
    await expect(page).toHaveURL(/sort=price-asc/)
    await expectGridToShow(app, sorted.body)
  })

  test('paginação sobrevive a refresh e ao histórico do navegador', async ({ app, page }) => {
    await app.goto('/')
    await expect(grid(app).locator(':scope > li')).toHaveCount(9)

    const second = await catalogResponse(
      page,
      () => page.getByRole('button', { name: 'Página 2' }).click(),
      (params) => params.get('page') === '2',
    )
    expect(second.params.get('page')).toBe('2')
    await expect(page).toHaveURL(/[?&]page=2/)
    await expectGridToShow(app, second.body)

    const third = await catalogResponse(
      page,
      () => page.getByRole('button', { name: 'Próxima página' }).click(),
      (params) => params.get('page') === '3',
    )
    expect(third.params.get('page')).toBe('3')
    await expect(page).toHaveURL(/[?&]page=3/)

    await page.goBack()
    await expect(page).toHaveURL(/[?&]page=2/)
    await expect(page.getByRole('button', { name: 'Página 2' })).toHaveAttribute('aria-current', 'page')
    await expectGridToShow(app, second.body)

    await page.goForward()
    await expect(page).toHaveURL(/[?&]page=3/)
    await expectGridToShow(app, third.body)

    await page.reload()
    await app.mocksReady()
    await expect(page.getByRole('button', { name: 'Página 3' })).toHaveAttribute('aria-current', 'page')
    await expectGridToShow(app, third.body)
  })

  test('estado completo restaurado por acesso direto à URL', async ({ app, page }) => {
    await app.goto('/?q=golden&collections=musica&sort=price-desc')
    const field = page.getByRole('searchbox', { name: 'Buscar NFTs' }).first()
    if (app.isMobile) await expect(field).toHaveValue('golden')
    await expect(page.getByRole('status').filter({ hasText: 'NFTs encontrados' })).toBeVisible()
    const names = await grid(app).getByRole('heading').allTextContents()
    expect(names.length).toBeGreaterThan(0)
    for (const name of names) expect(name.toLowerCase()).toContain('golden')
  })

  test('resultado vazio oferece limpar filtros', async ({ app, page }) => {
    await app.goto('/?q=inexistente-xyz')
    await expect(page.getByText('Nenhum NFT encontrado')).toBeVisible()
    await expect(page.getByRole('status').filter({ hasText: '0 NFTs encontrados' })).toBeAttached()
    await page.getByRole('button', { name: 'Limpar filtros' }).click()
    await expect(page).not.toHaveURL(/q=/)
    await expect(grid(app).locator(':scope > li')).toHaveCount(9)
  })

  test('navega do catálogo para o detalhe do NFT', async ({ app, page }) => {
    await app.goto('/')
    await grid(app).getByRole('link', { name: 'Emerald Ape #042' }).first().click()
    await expect(page).toHaveURL(/\/nft\/nft-001$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Emerald Ape #042' })).toBeVisible()
  })
})
