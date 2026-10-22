import { createFileRoute, Outlet } from '@tanstack/react-router'

// Layout sem path das rotas privadas. O guard de sessão (beforeLoad + redirect
// para /login?redirect=...) entra aqui quando a entidade de sessão existir.
export const Route = createFileRoute('/_authenticated')({
  component: Outlet,
})
