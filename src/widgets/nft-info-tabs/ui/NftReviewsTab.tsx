import type { NftDetailDto } from '@/shared/contracts'
import { formatShortDate } from '@/shared/lib'
import { StarRating } from '@/shared/ui'

export function NftReviewsTab({ nft }: { nft: NftDetailDto }) {
  return (
    <div className="flex flex-col gap-5">
      <p className="flex items-center gap-2 text-body text-foreground">
        <StarRating value={nft.rating.average} />
        <span>
          Nota média {nft.rating.average.toLocaleString('pt-BR')} · {nft.rating.count} avaliações
        </span>
      </p>
      <ul className="flex flex-col gap-4">
        {nft.reviews.map((review) => (
          <li key={review.id} className="border-b border-border pb-4 last:border-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <p className="text-body font-bold text-foreground">{review.author}</p>
              <StarRating value={review.rating} />
              <time dateTime={review.createdAt} className="text-caption text-text-secondary">
                {formatShortDate(review.createdAt)}
              </time>
            </div>
            <p className="mt-1 text-body text-text-secondary">{review.comment}</p>
          </li>
        ))}
      </ul>
      {nft.rating.count > nft.reviews.length && (
        <p className="text-caption text-text-secondary">
          Mostrando {nft.reviews.length} de {nft.rating.count} avaliações mais recentes.
        </p>
      )}
    </div>
  )
}
