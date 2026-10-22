import { env } from '@/shared/config'

export async function enableMocking() {
  if (!env.ENABLE_MOCKS) return

  const { worker } = await import('@/shared/mocks')
  await worker.start({
    onUnhandledRequest: 'bypass',
    quiet: import.meta.env.PROD,
  })
}
