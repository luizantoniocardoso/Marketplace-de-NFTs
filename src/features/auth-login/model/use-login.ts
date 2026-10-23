import { useMutation, useQueryClient } from '@tanstack/react-query'
import { login, startSession } from '@/entities/session'

export function useLogin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: login,
    onSuccess: (response) => startSession(queryClient, response),
  })
}
