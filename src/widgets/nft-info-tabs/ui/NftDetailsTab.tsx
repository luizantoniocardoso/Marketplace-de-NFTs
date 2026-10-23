import { NFT_NETWORK_LABELS, type NftDetailDto } from '@/shared/contracts'
import { shortenAddress } from '@/shared/lib'

export function NftDetailsTab({ nft }: { nft: NftDetailDto }) {
  const facts = [
    { term: 'Rede', value: `Cunhado na ${NFT_NETWORK_LABELS[nft.network]} com procedência imutável e metadados armazenados no IPFS.` },
    {
      term: 'Contrato',
      value: `Direitos autorais do criador: ${nft.contract.royaltyPercent}% nas vendas secundárias, pagos automaticamente pelos mercados compatíveis.`,
    },
    {
      term: 'Direitos autorais',
      value: `${shortenAddress(nft.contract.address)} • Contrato inteligente ${nft.contract.standard} verificado.`,
    },
  ]

  return (
    <div className="flex flex-col gap-6 text-caption leading-6 text-text-secondary md:text-body md:leading-6">
      <div className="flex flex-col gap-6">
        {nft.story.map((paragraph) => (
          <p key={paragraph.slice(0, 32)}>{paragraph}</p>
        ))}
      </div>
      <dl className="flex flex-col gap-4">
        {facts.map((fact) => (
          <div key={fact.term}>
            <dt className="font-bold text-foreground">{fact.term}:</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
