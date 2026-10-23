import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { getApiError } from '@/shared/api'
import { useSubscribeNewsletter } from '../api'

export function useNewsletterForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string>()
  const subscribe = useSubscribeNewsletter()

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(undefined)
    subscribe.mutate(
      { email: email.trim() },
      {
        onSuccess: () => {
          setEmail('')
          toast.success('Inscrição confirmada! Você receberá os próximos lançamentos.')
        },
        onError: (err) => {
          const apiError = getApiError(err)
          setError(apiError.fields?.email ?? apiError.message)
        },
      },
    )
  }

  return { email, setEmail, error, onSubmit, isPending: subscribe.isPending }
}
