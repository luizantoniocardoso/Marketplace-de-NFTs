import type { Page } from '@playwright/test'
import { expect, test } from './support/fixtures'

const NFT = { id: 'nft-003', name: 'Neon Vessel #552' }

async function recordPressedStates(page: Page, label: RegExp) {
  await page.evaluate((source) => {
    const pattern = new RegExp(source)
    const states: string[] = []
    Object.assign(window, { __pressedStates: states })
    const observer = new MutationObserver(() => {
      const button = [...document.querySelectorAll<HTMLButtonElement>('button[aria-pressed]')].find(
        (element) => pattern.test(element.getAttribute('aria-label') ?? '') && element.offsetParent !== null,
      )
      const state = button?.getAttribute('aria-pressed')
      if (state && states.at(-1) !== state) states.push(state)
    })
    observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['aria-pressed'] })
  }, label.source)
}

const pressedStates = (page: Page) =>
  page.evaluate(() => (window as unknown as { __pressedStates: string[] }).__pressedStates)

test.describe('favoritos', () => {
  test('visitante é levado ao login ao favoritar', async ({ app, page }) => {
    await app.openNft(NFT.id, NFT.name)
    await page
      .getByRole('button', { name: `Adicionar ${NFT.name} aos favoritos` })
      .first()
      .click()
    await expect(page).toHaveURL(/\/login\?redirect=%2Fnft%2Fnft-003/)
  })

  test('inclusão e remoção persistem para o usuário autenticado', async ({ app, page }) => {
    await app.login()
    await app.openNft(NFT.id, NFT.name)

    await page
      .getByRole('button', { name: `Adicionar ${NFT.name} aos favoritos` })
      .first()
      .click()
    const remove = page.getByRole('button', { name: `Remover ${NFT.name} dos favoritos` }).first()
    await expect(remove).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByText(`${NFT.name} foi adicionado aos favoritos.`)).toBeVisible()

    await page.reload()
    await app.mocksReady()
    await expect(remove).toHaveAttribute('aria-pressed', 'true')

    await app.goto('/favorites')
    await expect(page.getByRole('link', { name: NFT.name }).first()).toBeVisible()

    await page.getByRole('button', { name: `Remover ${NFT.name} dos favoritos` }).click()
    await expect(page.getByText(`${NFT.name} foi removido dos favoritos.`)).toBeVisible()
    await expect(page.getByRole('link', { name: NFT.name })).toHaveCount(0)
    await page.reload()
    await app.mocksReady()
    await expect(page.getByRole('link', { name: 'Sage Nomad #009' }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: NFT.name })).toHaveCount(0)
  })

  test('falha da mutation desfaz a atualização otimista e permite nova tentativa', async ({ app, page }) => {
    await app.login()
    await app.openNft(NFT.id, NFT.name)
    await app.setScenario('favorites-error')
    await recordPressedStates(page, new RegExp(`${NFT.name} (aos|dos) favoritos`))

    await page
      .getByRole('button', { name: `Adicionar ${NFT.name} aos favoritos` })
      .first()
      .click()
    await expect(page.getByText(`Não foi possível adicionar ${NFT.name} aos favoritos.`)).toBeVisible()
    const add = page.getByRole('button', { name: `Adicionar ${NFT.name} aos favoritos` }).first()
    await expect(add).toHaveAttribute('aria-pressed', 'false')
    expect(await pressedStates(page)).toEqual(['true', 'false'])

    await app.setScenario('default')
    await expect(page.getByText(`Não foi possível adicionar ${NFT.name} aos favoritos.`)).toBeHidden()
    await add.click()
    await expect(page.getByText(`${NFT.name} foi adicionado aos favoritos.`)).toBeVisible()
    await expect(page.getByRole('button', { name: `Remover ${NFT.name} dos favoritos` }).first()).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await page.reload()
    await app.mocksReady()
    await expect(page.getByRole('button', { name: `Remover ${NFT.name} dos favoritos` }).first()).toBeVisible()
  })
})
