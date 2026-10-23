import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext } from '@tanstack/react-router'
import { z } from 'zod/mini'
import { NotFoundPage } from '@/pages/not-found'
import { RootLayout } from '../layouts'

interface RouterContext {
  queryClient: QueryClient
}

const rootSearchSchema = z.object({
  auth: z.catch(z.optional(z.enum(['login', 'register'])), undefined),
})

export const Route = createRootRouteWithContext<RouterContext>()({
  validateSearch: rootSearchSchema,
  component: RootLayout,
  notFoundComponent: NotFoundPage,
})
