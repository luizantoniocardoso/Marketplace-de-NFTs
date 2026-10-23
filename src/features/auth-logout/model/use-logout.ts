import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { endSession, logout } from '@/entities/session'

export function useLogout() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  return useMutation({
    mutationFn: logout,
    onSettled: async () => {
      endSession(queryClient)
      toast.success('Você saiu da sua conta.')
      await navigate({ to: '/' })
    },
  })
}
