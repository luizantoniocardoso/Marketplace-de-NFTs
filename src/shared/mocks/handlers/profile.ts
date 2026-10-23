import { http, HttpResponse } from 'msw'
import { env } from '@/shared/config'
import type { ChangePasswordRequest, UpdateAvatarRequest, UpdateProfileRequest, UserDto } from '@/shared/contracts'
import { db } from '../db'
import {
  apiError,
  authenticate,
  EMAIL_PATTERN,
  ENS_PATTERN,
  hashPassword,
  noContent,
  randomToken,
  readJson,
  required,
  simulateNetwork,
  toUserDto,
  USERNAME_PATTERN,
  type FieldErrors,
} from '../services'

const AVATAR_PATTERN = /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/
const MAX_AVATAR_CHARS = 2_000_000

export const profileHandlers = [
  http.get(`${env.API_URL}/profile`, async ({ request }) => {
    const failure = await simulateNetwork()
    if (failure) return failure
    const auth = authenticate(request)
    if (auth.error) return auth.error
    return HttpResponse.json<UserDto>(toUserDto(auth.user))
  }),

  http.patch(`${env.API_URL}/profile`, async ({ request }) => {
    const failure = await simulateNetwork()
    if (failure) return failure
    const auth = authenticate(request)
    if (auth.error) return auth.error
    const body = await readJson<UpdateProfileRequest>(request)
    const username = body.username?.trim().toLowerCase() ?? ''
    const email = body.email?.trim().toLowerCase() ?? ''
    const fields: FieldErrors = {}
    required(fields, 'displayName', body.displayName, 'Informe o nome de exibição.')
    required(fields, 'walletNickname', body.walletNickname, 'Informe o apelido da carteira.')
    if (!USERNAME_PATTERN.test(username)) fields.username = 'Use de 3 a 20 letras minúsculas, números, ponto ou _.'
    if (!EMAIL_PATTERN.test(email)) fields.email = 'Informe um e-mail válido.'
    if (!body.ensName || !ENS_PATTERN.test(body.ensName)) fields.ensName = 'Informe um nome ENS válido.'
    const others = db.data.users.filter((user) => user.id !== auth.user.id)
    if (!fields.username && others.some((user) => user.username === username)) fields.username = 'Este nome de usuário já está em uso.'
    if (!fields.email && others.some((user) => user.email === email)) fields.email = 'Este e-mail já está em uso.'
    if (Object.keys(fields).length) {
      const conflict = fields.username?.includes('em uso') || fields.email?.includes('em uso')
      return apiError(conflict ? 'CONFLICT' : 'VALIDATION_ERROR', 'Revise os campos destacados.', fields)
    }
    Object.assign(auth.user, {
      displayName: body.displayName!.trim(),
      username,
      email,
      ensName: body.ensName,
      walletNickname: body.walletNickname!.trim(),
    })
    db.persist()
    return HttpResponse.json<UserDto>(toUserDto(auth.user))
  }),

  http.put(`${env.API_URL}/profile/avatar`, async ({ request }) => {
    const failure = await simulateNetwork()
    if (failure) return failure
    const auth = authenticate(request)
    if (auth.error) return auth.error
    const body = await readJson<UpdateAvatarRequest>(request)
    if (!body.dataUrl || !AVATAR_PATTERN.test(body.dataUrl)) {
      return apiError('VALIDATION_ERROR', 'Envie uma imagem PNG, JPG ou WebP.', { avatar: 'Envie uma imagem PNG, JPG ou WebP.' })
    }
    if (body.dataUrl.length > MAX_AVATAR_CHARS) {
      return apiError('VALIDATION_ERROR', 'A imagem deve ter no máximo 1,5 MB.', { avatar: 'A imagem deve ter no máximo 1,5 MB.' })
    }
    auth.user.avatarUrl = body.dataUrl
    db.persist()
    return HttpResponse.json<UserDto>(toUserDto(auth.user))
  }),

  http.delete(`${env.API_URL}/profile/avatar`, async ({ request }) => {
    const failure = await simulateNetwork()
    if (failure) return failure
    const auth = authenticate(request)
    if (auth.error) return auth.error
    auth.user.avatarUrl = null
    db.persist()
    return HttpResponse.json<UserDto>(toUserDto(auth.user))
  }),

  http.post(`${env.API_URL}/profile/password`, async ({ request }) => {
    const failure = await simulateNetwork()
    if (failure) return failure
    const auth = authenticate(request)
    if (auth.error) return auth.error
    const body = await readJson<ChangePasswordRequest>(request)
    const fields: FieldErrors = {}
    required(fields, 'currentPassword', body.currentPassword, 'Informe a senha atual.')
    if (!body.newPassword || body.newPassword.length < 8) fields.newPassword = 'A nova senha precisa ter ao menos 8 caracteres.'
    if (Object.keys(fields).length) return apiError('VALIDATION_ERROR', 'Revise os campos destacados.', fields)
    const matches = (await hashPassword(auth.user.passwordSalt, body.currentPassword!)) === auth.user.passwordHash
    if (!matches) return apiError('VALIDATION_ERROR', 'A senha atual está incorreta.', { currentPassword: 'A senha atual está incorreta.' })
    if (body.currentPassword === body.newPassword) {
      return apiError('VALIDATION_ERROR', 'A nova senha deve ser diferente da atual.', { newPassword: 'A nova senha deve ser diferente da atual.' })
    }
    auth.user.passwordSalt = randomToken('salt')
    auth.user.passwordHash = await hashPassword(auth.user.passwordSalt, body.newPassword!)
    db.persist()
    return noContent()
  }),
]
