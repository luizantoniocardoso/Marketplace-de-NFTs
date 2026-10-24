import type { Locator, Page } from '@playwright/test'
import { expect, test, USERS } from './support/fixtures'

async function tabUntil(page: Page, target: Locator, maxTabs = 40) {
  for (let index = 0; index < maxTabs; index += 1) {
    await page.keyboard.press('Tab')
    if (await target.evaluate((element) => element === document.activeElement).catch(() => false)) return
  }
  throw new Error('O elemento não recebeu foco pelo teclado')
}

async function hasVisibleFocus(locator: Locator) {
  return locator.evaluate((element) => {
    const style = getComputedStyle(element)
    const outline = style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0
    const ring = style.boxShadow !== 'none'
    return outline || ring
  })
}

test.describe('teclado, foco e validação', () => {
  test('skip link leva o foco ao conteúdo principal', async ({ app, page }) => {
    await app.goto('/')
    await page.keyboard.press('Tab')
    const skip = page.getByRole('link', { name: 'Pular para o conteúdo' })
    await expect(skip).toBeFocused()
    await expect(skip).toBeInViewport()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('main')).toBeFocused()
  })

  test('catálogo operável por teclado com foco visível', async ({ app, page }) => {
    test.skip(app.isMobile, 'Fluxo de teclado avaliado no layout desktop')
    await app.goto('/')
    const music = page
      .getByRole('complementary', { name: 'Filtros do catálogo' })
      .getByRole('button', { name: /^Música/ })
    await tabUntil(page, music, 80)
    expect(await hasVisibleFocus(music)).toBe(true)
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/collections=.*musica/)
    await expect(music).toHaveAttribute('aria-pressed', 'true')

    const firstCard = page.locator('ul[aria-busy="false"] > li').first().getByRole('link').first()
    await tabUntil(page, firstCard, 80)
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/nft\//)
  })

  test('busca do cabeçalho abre com foco no campo e fecha com Escape', async ({ app, page }) => {
    test.skip(app.isMobile, 'Busca do cabeçalho existe apenas no desktop')
    await app.goto('/')
    const toggle = page.getByRole('button', { name: 'Abrir busca' })
    await toggle.focus()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('searchbox', { name: 'Buscar NFTs' })).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('button', { name: 'Abrir busca' })).toBeFocused()
  })

  test('diálogo de autenticação prende o foco e devolve ao fechar', async ({ app, page }) => {
    test.skip(app.isMobile, 'No mobile a autenticação é uma tela cheia')
    await app.goto('/')
    const trigger = page.getByRole('link', { name: 'Entrar' })
    await trigger.focus()
    await page.keyboard.press('Enter')

    const dialog = page.getByRole('dialog', { name: 'Entrar' })
    await expect(dialog).toBeVisible()
    for (let index = 0; index < 15; index += 1) {
      await page.keyboard.press('Tab')
      expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true)
    }
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(page).not.toHaveURL(/auth=login/)
    await expect(trigger).toBeFocused()
  })

  test('folha de filtros no mobile prende o foco e devolve ao fechar', async ({ app, page }) => {
    test.skip(!app.isMobile, 'Folha de filtros existe apenas no mobile')
    await app.goto('/')
    const trigger = page.getByRole('button', { name: 'Filtros' })
    await trigger.focus()
    await page.keyboard.press('Enter')
    const sheet = page.getByRole('dialog', { name: 'Filtros' })
    await expect(sheet).toBeVisible()
    for (let index = 0; index < 10; index += 1) {
      await page.keyboard.press('Tab')
      expect(await sheet.evaluate((element) => element.contains(document.activeElement))).toBe(true)
    }
    await page.keyboard.press('Escape')
    await expect(sheet).toBeHidden()
    await expect(trigger).toBeFocused()
  })

  test('login por teclado: erros associados aos campos e foco no primeiro inválido', async ({ app, page }) => {
    await app.goto('/login')
    const form = app.authForm()
    const email = form.getByRole('textbox', { name: 'E-mail' })
    await email.focus()
    await page.keyboard.press('Enter')

    await expect(email).toBeFocused()
    await expect(email).toHaveAttribute('aria-invalid', 'true')
    await expect(email).toHaveAccessibleDescription('Informe seu e-mail.')
    await expect(form.getByLabel('Senha', { exact: true })).toHaveAccessibleDescription('Informe sua senha.')

    await page.keyboard.type(USERS.nova.email)
    await page.keyboard.press('Tab')
    await page.keyboard.type(USERS.nova.password)
    await page.keyboard.press('Enter')
    await app.expectSignedIn(USERS.nova)
  })

  test('diálogo de revisão do pedido recebe foco e fecha com Escape', async ({ app, page }) => {
    await app.login()
    await app.addToCart('nft-001', 'Emerald Ape #042')
    await app.openCheckout()
    const dialog = await app.startReview()
    expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true)
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(page.getByRole('button', { name: 'Confirmar compra' }).first()).toBeFocused()
  })
})
