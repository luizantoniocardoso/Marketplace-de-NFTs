import { NftLineItem } from '@/entities/nft'
import type { OrderDto } from '@/shared/contracts'
import { formatEth } from '@/shared/lib'

export function ReceiptLines({ order }: { order: OrderDto }) {
  return (
    <section aria-labelledby="receipt-lines-title" className="px-6 pt-5 sm:px-11">
      <h2 id="receipt-lines-title" className="text-body font-bold text-foreground">
        Detalhes da transação
      </h2>
      <table className="mt-1 w-full table-fixed">
        <caption className="sr-only">Itens comprados</caption>
        <colgroup>
          <col />
          <col className="w-[72px] sm:w-[96px]" />
          <col className="w-[104px] sm:w-[110px]" />
        </colgroup>
        <thead>
          <tr className="border-b border-border-soft text-body-md font-bold text-foreground">
            <th scope="col" className="pb-2 text-left">
              NFTs
            </th>
            <th scope="col" className="pb-2 text-center">
              Edições
            </th>
            <th scope="col" className="pb-2 text-right">
              Subtotal
            </th>
          </tr>
        </thead>
        <tbody>
          {order.lines.map((line) => (
            <tr key={`${line.nftId}-${line.editionId}`}>
              <th scope="row" className="py-1.5 text-left font-normal">
                <NftLineItem image={line.image} name={line.name} subtitle={`ID do token: ${line.tokenId}`} />
              </th>
              <td className="text-center text-caption text-text-secondary">
                <span className="sr-only">Quantidade: </span>(x {line.quantity})
              </td>
              <td className="text-right text-body-lg font-bold text-text-accent">{formatEth(line.lineTotalEth)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <dl className="mt-3 flex flex-col gap-1 border-b border-border-soft pb-2 pl-[30%]">
        {order.discountEth !== '0' && (
          <div className="flex justify-between text-body text-foreground">
            <dt>Desconto ({order.couponCode})</dt>
            <dd>(-) {formatEth(order.discountEth)}</dd>
          </div>
        )}
        <div className="flex justify-between text-body text-foreground">
          <dt>Taxa de rede</dt>
          <dd className="text-body-md">{formatEth(order.networkFeeEth)}</dd>
        </div>
        <div className="flex justify-between text-body font-bold text-foreground">
          <dt>Total</dt>
          <dd className="text-body-lg text-text-accent">{formatEth(order.totalEth, { maxDecimals: 6 })}</dd>
        </div>
      </dl>
    </section>
  )
}
