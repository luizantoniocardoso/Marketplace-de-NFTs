import { lazy, Suspense } from 'react'

const RouterDevtools = import.meta.env.DEV
  ? lazy(() => import('@tanstack/react-router-devtools').then((module) => ({ default: module.TanStackRouterDevtools })))
  : null

export function DevTools() {
  if (!RouterDevtools) return null

  return (
    <Suspense>
      <RouterDevtools />
    </Suspense>
  )
}
