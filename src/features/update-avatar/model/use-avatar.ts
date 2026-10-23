import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateSessionUser } from '@/entities/session'
import { profileKeys, removeAvatar, uploadAvatar } from '@/entities/user'
import { getApiError, useViewerId } from '@/shared/api'
import type { UserDto } from '@/shared/contracts'
import { readFileAsDataUrl } from '@/shared/lib'

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp']
const MAX_BYTES = 1.5 * 1024 * 1024

export const AVATAR_ACCEPT = ACCEPTED_TYPES.join(',')

export function validateAvatar(file: File) {
  if (!ACCEPTED_TYPES.includes(file.type)) return 'Envie uma imagem PNG, JPG ou WebP.'
  if (file.size > MAX_BYTES) return 'A imagem deve ter no máximo 1,5 MB.'
  return null
}

function useStoreUser() {
  const queryClient = useQueryClient()
  const viewerId = useViewerId()
  return (user: UserDto) => {
    queryClient.setQueryData(profileKeys.detail(viewerId), user)
    updateSessionUser(queryClient, user)
  }
}

export function useUploadAvatar() {
  const store = useStoreUser()
  return useMutation({
    mutationFn: async (file: File) => uploadAvatar({ dataUrl: await readFileAsDataUrl(file) }),
    onSuccess: (user) => {
      store(user)
      toast.success('Avatar atualizado.')
    },
    onError: (error) => toast.error(getApiError(error).fields?.avatar ?? getApiError(error).message),
  })
}

export function useRemoveAvatar() {
  const store = useStoreUser()
  return useMutation({
    mutationFn: removeAvatar,
    onSuccess: (user) => {
      store(user)
      toast.success('Avatar removido.')
    },
    onError: (error) => toast.error(getApiError(error).message),
  })
}
