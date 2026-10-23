import { http, HttpResponse } from 'msw'
import { env } from '@/shared/config'
import type { AuthResponse, LoginRequest, RegisterRequest, SessionDto } from '@/shared/contracts'
import { EMAIL_PATTERN, MIN_PASSWORD_LENGTH, USERNAME_PATTERN, VALIDATION_MESSAGES as MESSAGES } from '@/shared/lib'
import { db } from '../db'
import type { MockUser } from '../fixtures'
import {
  apiError,
  authenticate,
  bearerToken,
  createSession,
  deleteSession,
  hashPassword,
  mergeGuestCart,
  noContent,
  randomToken,
  readJson,
  simulateNetwork,
  toUserDto,
} from '../services'
import type { FieldErrors } from '../services'

function authResponse(request: Request, user: MockUser, status: number) {
  mergeGuestCart(request, user.id)
  const session = createSession(user.id)
  return HttpResponse.json<AuthResponse>(
    { user: toUserDto(user), token: session.token, expiresAt: session.expiresAt },
    { status },
  )
}

export const authHandlers = [
  http.post(`${env.API_URL}/auth/register`, async ({ request }) => {
    const failure = await simulateNetwork()
    if (failure) return failure
    const body = await readJson<RegisterRequest>(request)
    const username = body.username?.trim().toLowerCase() ?? ''
    const email = body.email?.trim().toLowerCase() ?? ''
    const fields: FieldErrors = {}
    if (!USERNAME_PATTERN.test(username)) fields.username = MESSAGES.usernameInvalid
    if (!EMAIL_PATTERN.test(email)) fields.email = MESSAGES.emailInvalid
    if (!body.password || body.password.length < MIN_PASSWORD_LENGTH) fields.password = MESSAGES.passwordTooShort
    if (Object.keys(fields).length) return apiError('VALIDATION_ERROR', 'Revise os campos destacados.', fields)

    if (db.data.users.some((user) => user.email === email)) {
      return apiError('CONFLICT', 'Já existe uma conta com este e-mail.', { email: 'Este e-mail já está cadastrado.' })
    }
    if (db.data.users.some((user) => user.username === username)) {
      return apiError('CONFLICT', 'Este nome de usuário já está em uso.', {
        username: 'Este nome de usuário já está em uso.',
      })
    }

    const salt = randomToken('salt')
    const user: MockUser = {
      id: db.nextId('user'),
      username,
      displayName: username,
      email,
      ensName: null,
      walletNickname: null,
      avatarUrl: null,
      passwordSalt: salt,
      passwordHash: await hashPassword(salt, body.password!),
    }
    db.data.users.push(user)
    db.persist()
    return authResponse(request, user, 201)
  }),

  http.post(`${env.API_URL}/auth/login`, async ({ request }) => {
    const failure = await simulateNetwork()
    if (failure) return failure
    const body = await readJson<LoginRequest>(request)
    const fields: FieldErrors = {}
    if (!body.email?.trim()) fields.email = MESSAGES.emailRequired
    if (!body.password) fields.password = MESSAGES.passwordRequired
    if (Object.keys(fields).length) return apiError('VALIDATION_ERROR', 'Revise os campos destacados.', fields)

    const user = db.data.users.find((item) => item.email === body.email!.trim().toLowerCase())
    const valid = user && (await hashPassword(user.passwordSalt, body.password!)) === user.passwordHash
    if (!user || !valid) return apiError('UNAUTHENTICATED', 'E-mail ou senha incorretos.')
    return authResponse(request, user, 200)
  }),

  http.get(`${env.API_URL}/auth/session`, async ({ request }) => {
    const failure = await simulateNetwork()
    if (failure) return failure
    const auth = authenticate(request)
    if (auth.error) return auth.error
    return HttpResponse.json<SessionDto>({ user: toUserDto(auth.user), expiresAt: auth.session.expiresAt })
  }),

  http.post(`${env.API_URL}/auth/logout`, async ({ request }) => {
    const failure = await simulateNetwork()
    if (failure) return failure
    const token = bearerToken(request)
    if (token) deleteSession(token)
    return noContent()
  }),
]
