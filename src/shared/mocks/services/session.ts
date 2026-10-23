import { API_HEADERS } from '@/shared/contracts'
import { db, type MockSession } from '../db'
import type { MockUser } from '../fixtures'
import { isScenario } from '../scenarios'
import { randomToken } from './crypto'
import { apiError } from './network'

const SESSION_TTL_MS = 8 * 60 * 60 * 1000

export type AuthResult = { user: MockUser; session: MockSession; error?: never } | { error: Response; user?: never }

export function bearerToken(request: Request) {
  const header = request.headers.get(API_HEADERS.authorization)
  return header?.startsWith('Bearer ') ? header.slice(7) : null
}

export function createSession(userId: string): MockSession {
  const session = {
    token: randomToken('sess'),
    userId,
    expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
  }
  db.data.sessions.push(session)
  db.persist()
  return session
}

export function deleteSession(token: string) {
  db.data.sessions = db.data.sessions.filter((session) => session.token !== token)
  db.persist()
}

export function expireAllSessions() {
  const past = new Date(Date.now() - 1000).toISOString()
  db.data.sessions.forEach((session) => (session.expiresAt = past))
  db.persist()
}

export function userForToken(token: string | null): MockUser | null {
  if (!token) return null
  const session = db.data.sessions.find((item) => item.token === token)
  if (!session || Date.parse(session.expiresAt) <= Date.now()) return null
  return db.data.users.find((user) => user.id === session.userId) ?? null
}

export function authenticate(request: Request): AuthResult {
  const token = bearerToken(request)
  if (!token) return { error: apiError('UNAUTHENTICATED', 'Entre na sua conta para continuar.') }
  if (isScenario('session-expired')) {
    return { error: apiError('SESSION_EXPIRED', 'Sua sessão expirou. Entre novamente para continuar.') }
  }
  const session = db.data.sessions.find((item) => item.token === token)
  if (!session) return { error: apiError('UNAUTHENTICATED', 'Sessão inválida. Entre novamente.') }
  if (Date.parse(session.expiresAt) <= Date.now()) {
    deleteSession(token)
    return { error: apiError('SESSION_EXPIRED', 'Sua sessão expirou. Entre novamente para continuar.') }
  }
  const user = db.data.users.find((item) => item.id === session.userId)
  if (!user) return { error: apiError('UNAUTHENTICATED', 'Conta não encontrada.') }
  return { user, session }
}

export function optionalUser(request: Request) {
  if (isScenario('session-expired')) return null
  return userForToken(bearerToken(request))
}
