import { useMutation, useQueryClient } from '@tanstack/react-query'
import { register, startSession } from '@/entities/session'

export function useRegister() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: register,
    onSuccess: (response) => startSession(queryClient, response),
  })
}
