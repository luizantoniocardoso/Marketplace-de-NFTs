import { NftLineItem } from '@/entities/nft'
import { CartItemQuantity, RemoveCartItemButton } from '@/features/edit-cart-item'
import type { CartItemDto } from '@/shared/contracts'
import { formatEth } from '@/shared/lib'
import { Skeleton } from '@/shared/ui'
import { CartItemStatus } from './CartItemStatus'

const cellClass = 'bg-surface-card py-0 align-middle'

export function CartTable({ items }: { items?: CartItemDto[] }) {
  return (
    <table className="hidden w-full table-fixed border-separate border-spacing-y-3 md:table">
      <caption className="sr-only">Itens do carrinho</caption>
      <colgroup>
        <col className="w-[40%]" />
        <col className="w-[18%]" />
        <col className="w-[17%]" />
        <col className="w-[18%]" />
        <col />
      </colgroup>
      <thead>
        <tr className="text-left text-body-md font-bold text-foreground">
          <th scope="col" className="border-b border-border pb-2.5">
            NFTs
          </th>
          <th scope="col" className="border-b border-border pb-2.5">
            Preço
          </th>
          <th scope="col" className="border-b border-border pb-2.5">
            Edições
          </th>
          <th scope="col" className="border-b border-border pb-2.5">
            Total
          </th>
          <th scope="col" className="border-b border-border pb-2.5">
            <span className="sr-only">Ações</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {items
          ? items.map((item) => (
              <tr key={item.id} className="h-[70px]">
                <th scope="row" className={`${cellClass} text-left font-normal`}>
                  <NftLineItem
                    image={item.image}
                    name={item.name}
                    subtitle={
                      <>
                        ID do token: {item.tokenId}
                        <span className="sr-only">, edição {item.editionLabel}</span>
                      </>
                    }
                  />
                </th>
                <td className={`${cellClass} text-body-md font-medium text-text-accent`}>
                  {formatEth(item.unitPriceEth)}
                  <CartItemStatus item={item} />
                </td>
                <td className={cellClass}>
                  <CartItemQuantity item={item} />
                  <span className="mt-1 block text-caption text-text-secondary">Edição {item.editionLabel}</span>
                </td>
                <td className={`${cellClass} text-body-md font-medium text-text-accent`}>
                  {formatEth(item.lineTotalEth)}
                </td>
                <td className={`${cellClass} text-center`}>
                  <RemoveCartItemButton item={item} className="mx-auto" />
                </td>
              </tr>
            ))
          : Array.from({ length: 3 }, (_, index) => (
              <tr key={index} aria-hidden="true" className="h-[70px]">
                <td className={cellClass}>
                  <div className="flex items-center gap-4">
                    <Skeleton className="size-[70px] rounded-sm" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </td>
                <td className={cellClass}>
                  <Skeleton className="h-4 w-20" />
                </td>
                <td className={cellClass}>
                  <Skeleton className="h-5 w-20" />
                </td>
                <td className={cellClass}>
                  <Skeleton className="h-4 w-20" />
                </td>
                <td className={cellClass} />
              </tr>
            ))}
      </tbody>
    </table>
  )
}
