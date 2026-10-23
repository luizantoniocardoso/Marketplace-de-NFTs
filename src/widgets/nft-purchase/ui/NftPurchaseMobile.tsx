import { ShoppingCart, Star } from 'lucide-react'
import { EditionPicker } from '@/entities/nft'
import type { NftDetailDto } from '@/shared/contracts'
import { formatEth } from '@/shared/lib'
import { Button, QuantityStepper } from '@/shared/ui'
import type { PurchaseState } from '../model'
import { NftMetaList } from './NftMetaList'

interface NftPurchaseMobileProps {
  nft: NftDetailDto
  purchase: PurchaseState
}

export function NftPurchaseMobile({ nft, purchase }: NftPurchaseMobileProps) {
  return (
    <div className="md:hidden">
      <div className="relative z-10 -mt-[38px] rounded-t-[32px] bg-surface-card px-6 pt-8 pb-8">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-title font-bold text-foreground">{nft.name}</h1>
          <p
            className="flex h-7 items-center gap-1 rounded-full border border-brand px-1.5 text-caption font-bold text-text-secondary"
            aria-label={`Nota ${nft.rating.average.toLocaleString('pt-BR')} de 5, ${nft.rating.count} avaliações`}
          >
            <Star className="size-4 fill-brand text-brand" aria-hidden="true" />
            {nft.rating.average.toLocaleString('pt-BR')}
            <span className="font-normal">({nft.rating.count})</span>
          </p>
        </div>
        <p className="mt-3 text-body leading-6 text-text-secondary">{nft.description}</p>
        <EditionPicker className="mt-3" editions={nft.editions} value={purchase.edition.id} onChange={purchase.selectEdition} />
        <NftMetaList nft={nft} className="mt-5" />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 rounded-t-[32px] bg-surface-card px-6 pt-6 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-12px_32px_rgba(0,0,0,0.45)]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-body-md font-bold text-foreground">Qtd.</span>
            <QuantityStepper
              value={purchase.quantity}
              max={Math.max(1, purchase.max)}
              disabled={purchase.soldOut}
              label="Quantidade"
              onChange={purchase.setQuantity}
            />
          </div>
          <p className="text-title font-bold text-text-accent">
            <span className="sr-only">Preço: </span>
            {purchase.soldOut ? 'Esgotado' : formatEth(purchase.edition.priceEth)}
          </p>
        </div>
        <div className="mt-5 flex items-center gap-3">
          <Button
            variant="brand-pill"
            size="pill"
            className="flex-1"
            disabled={purchase.soldOut || purchase.isAdding}
            onClick={purchase.buyNow}
          >
            {purchase.soldOut ? 'Esgotado' : 'Comprar NFT'}
          </Button>
          <button
            type="button"
            onClick={purchase.addToCart}
            disabled={purchase.soldOut || purchase.isAdding}
            aria-label={`Adicionar ${nft.name} ao carrinho`}
            className="grid size-[60px] shrink-0 place-items-center rounded-full border border-border bg-surface-raised text-brand transition-colors hover:text-brand-light disabled:opacity-50"
          >
            <ShoppingCart className="size-6" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
