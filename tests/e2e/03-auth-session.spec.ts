import { expect, test, USERS } from './support/fixtures'

const SESSION_TTL = '08:00:05'

test.describe('cadastro', () => {
  test('valida campos obrigatórios antes de enviar', async ({ app, page }) => {
    await app.goto('/register')
    const form = app.authForm('Criar conta')
    await form.getByRole('button', { name: 'Criar conta' }).click()

    const username = form.getByRole('textbox', { name: 'Nome de usuário' })
    await expect(username).toHaveAttribute('aria-invalid', 'true')
    await expect(username).toHaveAccessibleDescription(/Use de 3 a 20 letras/)
    await expect(form.getByRole('textbox', { name: 'E-mail' })).toHaveAccessibleDescription('Informe seu e-mail.')
    await expect(form.getByLabel('Senha', { exact: true })).toHaveAccessibleDescription(/ao menos 8 caracteres/)
    await expect(page).toHaveURL(/\/register$/)
  })

  test('trata conflito de e-mail e de nome de usuário retornados pela API', async ({ app }) => {
    await app.goto('/register')
    const form = app.authForm('Criar conta')
    await form.getByRole('textbox', { name: 'Nome de usuário' }).fill('colecionador_novo')
    await form.getByRole('textbox', { name: 'E-mail' }).fill(USERS.nova.email)
    await form.getByLabel('Senha', { exact: true }).fill('segredo123')
    await form.getByLabel('Confirmar senha').fill('segredo123')
    await form.getByRole('button', { name: 'Criar conta' }).click()
    await expect(form.getByRole('textbox', { name: 'E-mail' })).toHaveAccessibleDescription(
      'Este e-mail já está cadastrado.',
    )

    await form.getByRole('textbox', { name: 'Nome de usuário' }).fill(USERS.nova.username)
    await form.getByRole('textbox', { name: 'E-mail' }).fill('outro@kurio.dev')
    await form.getByRole('button', { name: 'Criar conta' }).click()
    await expect(form.getByRole('textbox', { name: 'Nome de usuário' })).toHaveAccessibleDescription(
      'Este nome de usuário já está em uso.',
    )
  })

  test('cria a conta, inicia a sessão e mantém após refresh', async ({ app, page }) => {
    await app.goto('/register?redirect=%2Fprofile')
    const form = app.authForm('Criar conta')
    await form.getByRole('textbox', { name: 'Nome de usuário' }).fill('colecionador_novo')
    await form.getByRole('textbox', { name: 'E-mail' }).fill('novo@kurio.dev')
    await form.getByLabel('Senha', { exact: true }).fill('segredo123')
    await form.getByLabel('Confirmar senha').fill('segredo123')
    await form.getByRole('button', { name: 'Criar conta' }).click()

    await expect(page).toHaveURL(/\/profile$/)
    await expect(page.getByRole('textbox', { name: 'Nome de usuário' })).toHaveValue('colecionador_novo')
    await page.reload()
    await app.mocksReady()
    await expect(page).toHaveURL(/\/profile$/)
    await expect(page.getByRole('textbox', { name: 'E-mail' }).first()).toHaveValue('novo@kurio.dev')

    const stored = await app.storage('kurio:mock-db')
    expect(stored).not.toContain('segredo123')
  })
})

test.describe('login e sessão', () => {
  test('rota privada redireciona para o login e retorna ao fluxo anterior', async ({ app, page }) => {
    await app.goto('/wallets')
    await expect(page).toHaveURL(/\/login\?redirect=%2Fwallets/)

    await app.fillLogin({ email: USERS.nova.email, password: 'senha-errada' })
    await expect(page.getByRole('alert').filter({ hasText: /incorret|inválid/i })).toBeVisible()

    await app.fillLogin(USERS.nova)
    await expect(page).toHaveURL(/\/wallets$/)
    await expect(page.getByRole('heading', { name: 'Carteira principal' })).toBeVisible()
  })

  test('expiração durante a navegação leva ao login e preserva o destino', async ({ app, page }) => {
    await app.login(USERS.nova, '/profile')
    await expect(page).toHaveURL(/\/profile$/)

    await page.clock.fastForward(SESSION_TTL)
    const walletsLink = page.getByRole('navigation', { name: 'Conta' }).getByRole('link', { name: 'Carteiras' })
    await walletsLink.click({ timeout: 3_000 }).catch(() => undefined)

    await expect(page).toHaveURL(/\/login\?.*reason=expired/)
    await expect(page.getByRole('status').filter({ hasText: 'Sua sessão expirou' })).toBeVisible()
    expect(await app.storage('kurio:session-token')).toBeNull()

    const redirect = new URL(page.url()).searchParams.get('redirect')
    expect(redirect).toMatch(/^\/(profile|wallets)$/)
    await app.fillLogin(USERS.nova)
    await expect(page).toHaveURL(new RegExp(`${redirect}$`))
  })

  test('expiração durante o checkout preserva o rascunho para retomada', async ({ app, page }) => {
    await app.login()
    await app.addToCart('nft-001', 'Emerald Ape #042')
    await app.openCheckout()

    const note = page.getByRole('textbox', { name: 'Observação do colecionador (opcional)' })
    await note.fill('Presente de aniversário')
    const displayName = page.getByRole('textbox', { name: 'Nome de exibição' })
    await displayName.fill('Nova Colecionadora')

    await app.mocks((mocks) => mocks.expireSessions())
    await page
      .getByRole('button', { name: 'Confirmar compra' })
      .first()
      .click({ timeout: 3_000 })
      .catch(() => undefined)

    await expect(page).toHaveURL(/\/login\?redirect=%2Fcheckout&reason=expired/)
    await app.fillLogin(USERS.nova)
    await expect(page).toHaveURL(/\/checkout$/)
    await expect(note).toHaveValue('Presente de aniversário')
    await expect(displayName).toHaveValue('Nova Colecionadora')
    await expect(page.getByRole('button', { name: 'Confirmar compra' }).first()).toBeEnabled()
  })

  test('logout e troca de usuário limpam os dados privados da sessão anterior', async ({ app, page }) => {
    await app.login(USERS.nova)
    await app.openNft('nft-003', 'Neon Vessel #552')
    await page.getByRole('button', { name: 'Adicionar Neon Vessel #552 aos favoritos' }).first().click()
    await expect(page.getByRole('button', { name: 'Remover Neon Vessel #552 dos favoritos' }).first()).toBeVisible()

    await app.logout()
    await expect(page).toHaveURL(/\/$/)
    const privateQueries = await page.evaluate(() =>
      Object.keys(sessionStorage).filter((key) => key.startsWith('kurio:checkout-draft')),
    )
    expect(privateQueries).toEqual([])

    await app.goto('/favorites')
    await expect(page).toHaveURL(/\/login/)
    await app.fillLogin(USERS.rafael)
    await expect(page).toHaveURL(/\/favorites$/)
    await expect(page.getByText('Neon Vessel #552')).toHaveCount(0)

    await app.goto('/profile')
    await expect(page.getByRole('textbox', { name: 'Nome de exibição' })).toHaveValue(USERS.rafael.displayName)
  })
})
