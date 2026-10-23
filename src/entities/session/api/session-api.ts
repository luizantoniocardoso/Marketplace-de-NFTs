import { http } from '@/shared/api'
import type { AuthResponse, LoginRequest, RegisterRequest, SessionDto } from '@/shared/contracts'

export async function fetchSession(signal?: AbortSignal) {
  const { data } = await http.get<SessionDto>('/auth/session', { signal })
  return data
}

export async function login(body: LoginRequest) {
  const { data } = await http.post<AuthResponse>('/auth/login', body)
  return data
}

export async function register(body: RegisterRequest) {
  const { data } = await http.post<AuthResponse>('/auth/register', body)
  return data
}

export async function logout() {
  await http.post('/auth/logout')
}
