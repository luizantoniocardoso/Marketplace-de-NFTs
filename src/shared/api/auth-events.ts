import type { ApiErrorCode } from '@/shared/contracts'

export type AuthFailureCode = Extract<ApiErrorCode, 'UNAUTHENTICATED' | 'SESSION_EXPIRED'>

type AuthFailureListener = (code: AuthFailureCode) => void

const listeners = new Set<AuthFailureListener>()

export function onAuthFailure(listener: AuthFailureListener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function emitAuthFailure(code: AuthFailureCode) {
  listeners.forEach((listener) => listener(code))
}
