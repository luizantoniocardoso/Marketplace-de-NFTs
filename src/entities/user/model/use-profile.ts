import { useQuery } from '@tanstack/react-query'
import { useViewerId } from '@/shared/api'
import { profileQueries } from '../api'

export function useProfile() {
  return useQuery(profileQueries.detail(useViewerId()))
}
