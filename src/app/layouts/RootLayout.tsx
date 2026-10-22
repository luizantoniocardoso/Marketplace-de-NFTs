import { Outlet } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

const RouterDevtools = import.meta.env.DEV
  ? lazy(() =>
      import('@tanstack/react-router-devtools').then((m) => ({
        default: m.TanStackRouterDevtools,
      })),
    )
  : () => null

export function RootLayout() {
  return (
    <>
      <Outlet />
      <Suspense>
        <RouterDevtools />
      </Suspense>
    </>
  )
}
