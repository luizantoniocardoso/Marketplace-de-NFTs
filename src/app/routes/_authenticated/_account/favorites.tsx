import { createFileRoute } from '@tanstack/react-router'
import { favoriteQueries } from '@/entities/favorite'
import { FavoritesPage } from '@/pages/favorites'
import { viewer } from '@/shared/api'

export const Route = createFileRoute('/_authenticated/_account/favorites')({
  loader: ({ context }) => {
    void context.queryClient.prefetchQuery(favoriteQueries.list(viewer.getId()))
  },
  component: FavoritesPage,
})
