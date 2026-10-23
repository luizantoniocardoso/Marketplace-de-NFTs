import type { MockControls } from '@/shared/mocks'
import { env } from '@/shared/config'

declare global {
  interface Window {
    __kurioMocks?: MockControls
  }
}

export async function enableMocking() {
  if (!env.ENABLE_MOCKS) return

  const { applyMockParams, mockControls, startMockServices, worker } = await import('@/shared/mocks')
  const cleanUrl = applyMockParams(new URL(window.location.href))
  if (cleanUrl) {
    window.location.replace(cleanUrl)
    return new Promise<never>(() => undefined)
  }

  await worker.start({
    onUnhandledRequest: 'bypass',
    quiet: import.meta.env.PROD,
  })
  startMockServices()
  window.__kurioMocks = mockControls
}
