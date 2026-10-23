import { useNavigate, useSearch } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

const AuthDialog = lazy(() => import('@/widgets/auth-card').then((module) => ({ default: module.AuthDialog })))

export function AuthDialogHost() {
  const mode = useSearch({ strict: false, select: (search) => search.auth })
  const navigate = useNavigate()

  if (!mode) return null

  return (
    <Suspense>
      <AuthDialog
        mode={mode}
        onModeChange={(next) => void navigate({ to: '.', search: (prev) => ({ ...prev, auth: next }), replace: true, resetScroll: false })}
        onClose={() => void navigate({ to: '.', search: (prev) => ({ ...prev, auth: undefined }), replace: true, resetScroll: false })}
      />
    </Suspense>
  )
}
