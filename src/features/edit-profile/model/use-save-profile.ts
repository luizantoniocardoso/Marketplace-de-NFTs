import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateSessionUser } from '@/entities/session'
import { changePassword, profileKeys, updateProfile } from '@/entities/user'
import { useViewerId } from '@/shared/api'
import type { ProfileValues } from './profile-schema'

export function useSaveProfile() {
  const queryClient = useQueryClient()
  const viewerId = useViewerId()

  return useMutation({
    mutationFn: async (values: ProfileValues) => {
      const user = await updateProfile({
        displayName: values.displayName,
        username: values.username,
        email: values.email,
        ensName: `${values.ensLabel}${values.ensSuffix}`,
        walletNickname: values.walletNickname,
      })
      queryClient.setQueryData(profileKeys.detail(viewerId), user)
      updateSessionUser(queryClient, user)
      if (values.currentPassword) {
        await changePassword({ currentPassword: values.currentPassword, newPassword: values.newPassword })
      }
      return { user, passwordChanged: Boolean(values.currentPassword) }
    },
  })
}
