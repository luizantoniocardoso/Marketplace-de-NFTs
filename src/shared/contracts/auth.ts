export interface UserDto {
  id: string
  username: string
  displayName: string
  email: string
  ensName: string | null
  walletNickname: string | null
  avatarUrl: string | null
}

export interface SessionDto {
  user: UserDto
  expiresAt: string
}

export interface AuthResponse extends SessionDto {
  token: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface UpdateProfileRequest {
  displayName: string
  username: string
  email: string
  ensName: string
  walletNickname: string
}

export interface UpdateAvatarRequest {
  dataUrl: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export const ENS_SUFFIXES = ['.eth', '.kurio.eth'] as const
export type EnsSuffix = (typeof ENS_SUFFIXES)[number]
