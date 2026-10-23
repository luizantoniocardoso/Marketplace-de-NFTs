import { createFileRoute } from '@tanstack/react-router'
import { catalogSearchSchema, nftQueries, toNftListParams } from '@/entities/nft'
import { HomePage } from '@/pages/home'

export const Route = createFileRoute('/')({
  validateSearch: catalogSearchSchema,
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) => {
    void context.queryClient.prefetchQuery(nftQueries.list(toNftListParams(deps)))
  },
  component: HomePage,
})
