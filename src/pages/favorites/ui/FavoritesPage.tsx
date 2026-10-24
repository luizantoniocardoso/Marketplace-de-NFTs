import { useQueries } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Heart } from 'lucide-react'
import { useFavorites } from '@/entities/favorite'
import { NftCard, NftCardSkeleton, nftQueries } from '@/entities/nft'
import { FavoriteButton } from '@/features/toggle-favorite'
import { useDocumentTitle } from '@/shared/lib'
import { Button, StateMessage } from '@/shared/ui'

export function FavoritesPage() {
  useDocumentTitle('Lista de interesse')
  const favorites = useFavorites()
  const ids = favorites.data?.nftIds ?? []
  const details = useQueries({ queries: ids.map((id) => nftQueries.detail(id)) })

  return (
    <section aria-labelledby="favorites-title">
      <h1 id="favorites-title" className="text-body-md font-bold text-foreground md:mt-1">
        Lista de interesse
      </h1>
      {favorites.isSuccess && ids.length === 0 ? (
        <StateMessage
          className="mt-8"
          icon={Heart}
          title="Nenhum favorito ainda"
          description="Toque no coração de um NFT para acompanhá-lo aqui."
          action={
            <Button asChild variant="brand" size="md">
              <Link to="/">Explorar NFTs</Link>
            </Button>
          }
        />
      ) : (
        <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3 lg:gap-x-[34px]">
          {favorites.isPending
            ? Array.from({ length: 3 }, (_, index) => (
                <li key={index}>
                  <NftCardSkeleton />
                </li>
              ))
            : details.map((query, index) => (
                <li key={ids[index]}>
                  {query.data ? (
                    <NftCard
                      nft={query.data}
                      action={<FavoriteButton nftId={query.data.id} nftName={query.data.name} variant="icon" />}
                    />
                  ) : (
                    <NftCardSkeleton />
                  )}
                </li>
              ))}
        </ul>
      )}
    </section>
  )
}
