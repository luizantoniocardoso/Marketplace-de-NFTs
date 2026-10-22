import { expect, test } from '@playwright/test'

test('carrega a página inicial', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1, name: 'Início' })).toBeVisible()
})

test('exibe a página de rota inexistente', async ({ page }) => {
  await page.goto('/rota-que-nao-existe')
  await expect(page.getByRole('heading', { level: 1, name: 'Página não encontrada' })).toBeVisible()
})

test('responde REST pelos handlers do MSW', async ({ page }) => {
  await page.goto('/')
  // O app só renderiza depois que o worker do MSW está ativo.
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

  const body = await page.evaluate(() => fetch('/api/health').then((res) => res.json()))
  expect(body).toEqual({ status: 'ok' })
})
