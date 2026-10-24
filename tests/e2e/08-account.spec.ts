import { expect, test, USERS } from './support/fixtures'

const PNG_1PX = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
)

test.describe('perfil do colecionador', () => {
  test.beforeEach(async ({ app }) => {
    await app.login(USERS.nova, '/profile')
  })

  test('valida campos no cliente e erros retornados pela API', async ({ page }) => {
    const displayName = page.getByRole('textbox', { name: 'Nome de exibição' })
    const email = page.getByRole('textbox', { name: 'E-mail' }).first()
    await displayName.fill('')
    await email.fill('email-invalido')
    await page.getByRole('button', { name: 'Salvar', exact: true }).click()
    await expect(displayName).toHaveAccessibleDescription('Informe o nome de exibição.')
    await expect(email).toHaveAccessibleDescription('Informe um e-mail válido.')
    await expect(displayName).toBeFocused()

    await displayName.fill('Nova Sato')
    await email.fill(USERS.nova.email)
    const username = page.getByRole('textbox', { name: 'Nome de usuário' })
    await username.fill(USERS.rafael.username)
    await page.getByRole('button', { name: 'Salvar', exact: true }).click()
    await expect(username).toHaveAccessibleDescription('Este nome de usuário já está em uso.')
  })

  test('edição dos dados permanece após refresh', async ({ app, page }) => {
    await page.getByRole('textbox', { name: 'Nome de exibição' }).fill('Nova S. Colecionadora')
    await page.getByRole('textbox', { name: 'Apelido da carteira' }).fill('Cofre')
    await page.getByRole('button', { name: 'Salvar', exact: true }).click()
    await expect(page.getByText('Perfil atualizado.')).toBeVisible()

    await page.reload()
    await app.mocksReady()
    await expect(page.getByRole('textbox', { name: 'Nome de exibição' })).toHaveValue('Nova S. Colecionadora')
    await expect(page.getByRole('textbox', { name: 'Apelido da carteira' })).toHaveValue('Cofre')
    if (!app.isMobile) {
      await expect(page.getByRole('link', { name: 'Meu perfil, Nova S. Colecionadora' })).toBeVisible()
    }
  })

  test('avatar valida o arquivo, envia, persiste e pode ser removido', async ({ app, page }) => {
    const input = page.locator('input[type="file"]')
    await input.setInputFiles({ name: 'avatar.gif', mimeType: 'image/gif', buffer: PNG_1PX })
    await expect(page.getByRole('alert').filter({ hasText: 'Envie uma imagem PNG, JPG ou WebP.' })).toBeVisible()

    await input.setInputFiles({ name: 'avatar.png', mimeType: 'image/png', buffer: PNG_1PX })
    const avatar = page.getByRole('img', { name: 'Avatar de Nova Sato' }).first()
    await expect(avatar).toBeVisible()
    await page.reload()
    await app.mocksReady()
    await expect(avatar).toBeVisible()

    await page.getByRole('button', { name: 'Remover', exact: true }).click()
    await expect(page.getByRole('img', { name: 'Avatar de Nova Sato' })).toHaveCount(0)
  })

  test('alteração de senha exige a senha atual correta', async ({ app, page }) => {
    const current = page.getByLabel('Senha atual')
    await page.getByLabel('Nova senha', { exact: true }).fill('novaSenha99')
    await page.getByLabel('Confirmar nova senha').fill('outraSenha')
    await page.getByRole('button', { name: 'Salvar', exact: true }).click()
    await expect(current).toHaveAccessibleDescription('Informe a senha atual para alterá-la.')
    await expect(page.getByLabel('Confirmar nova senha')).toHaveAccessibleDescription('As senhas não coincidem.')

    await current.fill('senha-errada')
    await page.getByLabel('Confirmar nova senha').fill('novaSenha99')
    await page.getByRole('button', { name: 'Salvar', exact: true }).click()
    await expect(current).toHaveAccessibleDescription('A senha atual está incorreta.')

    await current.fill(USERS.nova.password)
    await page.getByRole('button', { name: 'Salvar', exact: true }).click()
    await expect(page.getByText('Perfil e senha atualizados.')).toBeVisible()

    await app.logout()
    await app.goto('/login')
    await app.fillLogin(USERS.nova)
    await expect(page.getByRole('alert').filter({ hasText: /incorret|inválid/i })).toBeVisible()
    await app.fillLogin({ email: USERS.nova.email, password: 'novaSenha99' })
    await app.expectSignedIn(USERS.nova)
  })
})

test.describe('carteiras', () => {
  test('edita a carteira principal com validação e persiste após refresh', async ({ app, page }) => {
    await app.login(USERS.nova, '/wallets')
    const primary = page.getByRole('region', { name: 'Carteira principal' })
    const address = primary.getByRole('textbox', { name: 'Endereço da carteira' })

    await address.fill('0x123')
    await primary.getByRole('textbox', { name: 'Apelido da carteira' }).fill('')
    await primary.getByRole('button', { name: 'Salvar carteira' }).click()
    await expect(address).toHaveAccessibleDescription('Endereço inválido para a rede selecionada.')
    await expect(primary.getByRole('textbox', { name: 'Apelido da carteira' })).toHaveAccessibleDescription(
      'Preencha este campo.',
    )

    const newAddress = '0x1111111111111111111111111111111111111111'
    await address.fill(newAddress)
    await primary.getByRole('textbox', { name: 'Apelido da carteira' }).fill('Cofre frio')
    await primary.getByRole('button', { name: 'Salvar carteira' }).click()
    await expect(page.getByText('Carteira principal salva.')).toBeVisible()

    await page.reload()
    await app.mocksReady()
    await expect(address).toHaveValue(newAddress)
    await expect(primary.getByRole('textbox', { name: 'Apelido da carteira' })).toHaveValue('Cofre frio')
  })

  test('cadastra a carteira secundária a partir da principal', async ({ app, page }) => {
    await app.login(USERS.rafael, '/wallets')
    const secondary = page.getByRole('region', { name: 'Carteira secundária' })
    await expect(secondary.getByText('Você ainda não adicionou uma carteira secundária.')).toBeVisible()

    await secondary.getByRole('checkbox', { name: 'Igual à carteira principal' }).click()
    await secondary.getByRole('button', { name: 'Adicionar' }).click()
    await expect(secondary.getByRole('textbox', { name: 'Nome de exibição' })).toHaveValue(USERS.rafael.displayName)
    await expect(secondary.getByRole('textbox', { name: 'Apelido da carteira' })).toHaveValue('Reserva')

    await secondary
      .getByRole('textbox', { name: 'Endereço da carteira' })
      .fill('0x2222222222222222222222222222222222222222')
    await secondary.getByRole('button', { name: 'Salvar carteira' }).click()
    await expect(secondary.getByText('Use como alternativa no pagamento.')).toBeVisible()

    await page.reload()
    await app.mocksReady()
    await expect(secondary.getByText('Use como alternativa no pagamento.')).toBeVisible()
    await expect(secondary.getByRole('textbox', { name: 'Endereço da carteira' })).toHaveValue(
      '0x2222222222222222222222222222222222222222',
    )
  })
})
