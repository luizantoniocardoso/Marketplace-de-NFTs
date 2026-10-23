import { createFileRoute } from '@tanstack/react-router'
import { profileQueries } from '@/entities/user'
import { ProfilePage } from '@/pages/profile'
import { viewer } from '@/shared/api'

export const Route = createFileRoute('/_authenticated/_account/profile')({
  loader: ({ context }) => {
    void context.queryClient.prefetchQuery(profileQueries.detail(viewer.getId()))
  },
  component: ProfilePage,
})
