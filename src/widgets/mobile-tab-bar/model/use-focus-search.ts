import { useNavigate } from '@tanstack/react-router'
import { MOBILE_SEARCH_INPUT_ID } from '@/shared/config'

export function useFocusSearch() {
  const navigate = useNavigate()

  return async () => {
    await navigate({ to: '/' })
    const input = document.getElementById(MOBILE_SEARCH_INPUT_ID)
    input?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    input?.focus({ preventScroll: true })
  }
}
