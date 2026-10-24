import { test as base, expect, type Locator, type Page } from '@playwright/test'

export const USERS = {
  nova: { email: 'nova@kurio.dev', password: 'kurio123', displayName: 'Nova Sato', username: 'novasato' },
  rafael: { email: 'rafael@kurio.dev', password: 'kurio123', displayName: 'Rafael Lima', username: 'rafalima' },
} as const

export type DemoUser = (typeof USERS)[keyof typeof USERS]

export type Scenario =
  | 'default'
  | 'slow'
  | 'variable-latency'
  | 'offline'
  | 'server-error'
  | 'empty-catalog'
  | 'session-expired'
  | 'favorites-error'
  | 'price-change'
  | 'sold-out'
  | 'wallet-rejected'
  | 'order-timeout'
  | 'payment-declined'

export const FIXED_NOW = new Date('2026-10-20T15:00:00.000Z')
const SCENARIO_KEY = 'kurio:mock-scenario'

interface MockControlsApi {
  setScenario(scenario: Scenario): void
  reset(): void
  expireSessions(): void
  raisePrice(nftId: string, editionId: string, percent: number): unknown
  setAvailability(nftId: string, editionId: string, available: number): boolean
  replayLastEvent(options?: { stale?: boolean }): boolean
  dropConnections(): void
}

declare global {
  interface Window {
    __kurioMocks?: MockControlsApi
  }
}

export class App {
  readonly page: Page
  readonly isMobile: boolean

  constructor(page: Page, isMobile: boolean) {
    this.page = page
    this.isMobile = isMobile
  }

  async useScenario(scenario: Scenario) {
    await this.page.addInitScript(
      ([key, value]) => {
        if (sessionStorage.getItem('e2e:scenario-applied') === value) return
        sessionStorage.setItem('e2e:scenario-applied', value)
        if (value === 'default') localStorage.removeItem(key)
        else localStorage.setItem(key, value)
      },
      [SCENARIO_KEY, scenario] as const,
    )
  }

  async goto(path: string) {
    await this.page.goto(path)
    await this.mocksReady()
  }

  async mocksReady() {
    await this.page.waitForFunction(() => Boolean(window.__kurioMocks), undefined, { timeout: 20_000 })
  }

  async setScenario(scenario: Scenario) {
    await this.page.evaluate((value) => window.__kurioMocks!.setScenario(value), scenario)
  }

  async mocks<T>(fn: (mocks: MockControlsApi) => T) {
    return this.page.evaluate(`(${fn.toString()})(window.__kurioMocks)`) as Promise<Awaited<T>>
  }

  main() {
    return this.page.getByRole('main')
  }

  authForm(button: 'Entrar' | 'Criar conta' = 'Entrar') {
    return this.page.locator('form').filter({ has: this.page.getByRole('button', { name: button, exact: true }) })
  }

  async fillLogin(user: { email: string; password: string }) {
    const form = this.authForm()
    await form.getByRole('textbox', { name: 'E-mail' }).fill(user.email)
    await form.getByLabel('Senha', { exact: true }).fill(user.password)
    await form.getByRole('button', { name: 'Entrar', exact: true }).click()
  }

  async login(user: DemoUser = USERS.nova, redirect = '/') {
    await this.goto(`/login?redirect=${encodeURIComponent(redirect)}`)
    await this.fillLogin(user)
    await this.expectSignedIn(user)
  }

  accountLink(user: DemoUser) {
    return this.page.getByRole('link', { name: `Meu perfil, ${user.displayName}` })
  }

  async expectSignedIn(user: DemoUser) {
    if (this.isMobile) {
      await expect.poll(() => this.page.evaluate(() => localStorage.getItem('kurio:session-token'))).toBeTruthy()
      return
    }
    await expect(this.accountLink(user)).toBeVisible()
  }

  async openNft(id: string, name: string) {
    await this.goto(`/nft/${id}`)
    await expect(this.page.getByRole('heading', { level: 1, name })).toBeVisible()
  }

  buyButton() {
    return this.isMobile
      ? this.page.getByRole('button', { name: 'Comprar NFT' })
      : this.page.getByRole('button', { name: 'COMPRAR' })
  }

  addToCartButton(name: string) {
    return this.page.getByRole('button', { name: `Adicionar ${name} ao carrinho` })
  }

  async addToCart(id: string, name: string) {
    await this.openNft(id, name)
    await this.buyButton().click()
    await this.page.waitForURL('**/cart')
    await expect(this.cartLine(name)).toBeVisible()
  }

  cartLine(name: string): Locator {
    return this.isMobile
      ? this.page.getByRole('list', { name: 'Itens do carrinho' }).getByRole('listitem').filter({ hasText: name })
      : this.page.getByRole('table', { name: 'Itens do carrinho' }).getByRole('row').filter({ hasText: name })
  }

  cartSummary() {
    return this.isMobile
      ? this.page.getByRole('region', { name: 'Resumo do pedido' })
      : this.page.getByRole('region', { name: 'Resumo da carteira' })
  }

  summaryValue(label: string, scope: Locator = this.cartSummary()) {
    return scope.locator(`dt:text-is("${label}") + dd`)
  }

  async openCheckout() {
    await this.goto('/checkout')
    await expect(this.page.getByRole('heading', { level: 1, name: /^Pagamento/ })).toBeAttached()
    await expect(this.page.getByRole('button', { name: 'Confirmar compra' }).first()).toBeEnabled()
  }

  async startReview() {
    await this.page.getByRole('button', { name: 'Confirmar compra' }).first().click()
    const dialog = this.page.getByRole('dialog', { name: 'Revise sua compra' })
    await expect(dialog).toBeVisible()
    return dialog
  }

  async placeOrder() {
    const dialog = await this.startReview()
    await dialog.getByRole('button', { name: 'Confirmar compra' }).click()
    await this.page.waitForURL(/\/orders\/[^/]+$/)
    return this.page.url().split('/orders/')[1]
  }

  receiptStatus() {
    return this.page.getByRole('status').getByRole('heading', { level: 1 })
  }

  async logout() {
    await this.goto('/profile')
    await this.page.getByRole('button', { name: 'Sair' }).click()
    await expect.poll(() => this.storage('kurio:session-token')).toBeNull()
  }

  async realtimeConnected() {
    await expect(this.page.locator('html')).toHaveAttribute('data-realtime', 'connected')
  }

  async storage(key: string) {
    return this.page.evaluate((k) => localStorage.getItem(k), key)
  }
}

export const test = base.extend<{ app: App }>({
  app: async ({ page, isMobile }, use) => {
    await page.clock.install({ time: FIXED_NOW })
    await use(new App(page, isMobile))
  },
})

export { expect }
