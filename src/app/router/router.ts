import { createRouter } from '@tanstack/react-router'
import { queryClient } from '@/shared/api'
import { routeTree } from './routeTree.gen'

export const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: 'intent',
  // O cache fica com o TanStack Query; o router sempre delega a ele.
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
