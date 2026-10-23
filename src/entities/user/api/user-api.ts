import { queryOptions } from '@tanstack/react-query'
import { http, privateKey } from '@/shared/api'
import type { ChangePasswordRequest, UpdateAvatarRequest, UpdateProfileRequest, UserDto } from '@/shared/contracts'

export async function fetchProfile(signal?: AbortSignal) {
  const { data } = await http.get<UserDto>('/profile', { signal })
  return data
}

export async function updateProfile(body: UpdateProfileRequest) {
  const { data } = await http.patch<UserDto>('/profile', body)
  return data
}

export async function uploadAvatar(body: UpdateAvatarRequest) {
  const { data } = await http.put<UserDto>('/profile/avatar', body)
  return data
}

export async function removeAvatar() {
  const { data } = await http.delete<UserDto>('/profile/avatar')
  return data
}

export async function changePassword(body: ChangePasswordRequest) {
  await http.post('/profile/password', body)
}

export const profileKeys = {
  detail: (viewerId: string | null) => privateKey(viewerId, 'profile'),
}

export const profileQueries = {
  detail: (viewerId: string | null) =>
    queryOptions({
      queryKey: profileKeys.detail(viewerId),
      queryFn: ({ signal }) => fetchProfile(signal),
      enabled: Boolean(viewerId),
    }),
}
