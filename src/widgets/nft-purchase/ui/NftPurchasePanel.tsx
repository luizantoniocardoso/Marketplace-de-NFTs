import { EditionPicker, NftPrice } from '@/entities/nft'
import { FavoriteButton } from '@/features/toggle-favorite'
import type { NftDetailDto } from '@/shared/contracts'
import { Button, QuantityStepper, StarRating } from '@/shared/ui'
import type { PurchaseState } from '../model'
import { NftMetaList } from './NftMetaList'
import { NftShareLinks } from './NftShareLinks'

interface NftPurchasePanelProps {
  nft: NftDetailDto
  purchase: PurchaseState
  shareUrl: string
}

export function NftPurchasePanel({ nft, purchase, shareUrl }: NftPurchasePanelProps) {
  return (
    <div className="hidden md:block">
      <h1 className="text-[28px] leading-9 font-bold text-foreground">{nft.name}</h1>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-2">
        <NftPrice
          nft={{ priceEth: purchase.edition.priceEth, previousPriceEth: null, available: purchase.edition.available }}
          className="text-title"
        />
        <p className="flex items-center gap-1.5 text-body text-foreground">
          <StarRating value={nft.rating.average} />
          {nft.rating.count} avaliações de colecionadores
        </p>
      </div>

      <h2 className="mt-4 text-body font-bold text-foreground">Sobre este NFT:</h2>
      <p className="mt-3 text-caption leading-6 text-text-secondary">{nft.description}</p>

      <EditionPicker
        className="mt-2"
        editions={nft.editions}
        value={purchase.edition.id}
        onChange={purchase.selectEdition}
      />

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <QuantityStepper
          size="lg"
          value={purchase.quantity}
          max={Math.max(1, purchase.max)}
          disabled={purchase.soldOut}
          label="Quantidade"
          onChange={purchase.setQuantity}
        />
        <div className="flex gap-2">
          <Button
            variant="brand"
            size="md"
            className="w-[130px] text-body"
            disabled={purchase.soldOut || purchase.isAdding}
            onClick={purchase.buyNow}
          >
            {purchase.soldOut ? 'ESGOTADO' : purchase.isAdding ? 'ADICIONANDO…' : 'COMPRAR'}
          </Button>
          <FavoriteButton nftId={nft.id} nftName={nft.name} className="h-10" />
        </div>
      </div>
      <p className="mt-2 text-caption text-text-secondary" aria-live="polite">
        {purchase.soldOut
          ? `A edição ${purchase.edition.label} está esgotada. Escolha outra edição.`
          : `Máximo de ${purchase.max} por pedido nesta edição.`}
      </p>

      <NftMetaList nft={nft} className="mt-3" />
      <div className="mt-3">
        <NftShareLinks name={nft.name} url={shareUrl} />
      </div>
    </div>
  )
}
