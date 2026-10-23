import { Link } from '@tanstack/react-router'
import { artworkSrcSet, artworkUrl } from '@/shared/lib'

const FEATURED = {
  id: 'nft-002',
  artwork: 'sage-nomad',
  alt: 'Sage Nomad #009: gorila grisalho com chapéu bucket verde e moletom lilás',
}

export function FeaturedNftBanner() {
  return (
    <Link
      to="/nft/$nftId"
      params={{ nftId: FEATURED.id }}
      className="group block overflow-hidden bg-gradient-to-b from-[#2a1a0f] to-surface-card pt-[18px] transition-colors"
    >
      <p className="px-[18px] text-[22px] leading-8 font-bold text-text-accent">NFT EM DESTAQUE</p>
      <p className="mt-1 text-center text-title font-bold text-foreground">OFERTA LIMITADA</p>
      <img
        src={artworkUrl(FEATURED.artwork, 960)}
        srcSet={artworkSrcSet(FEATURED.artwork)}
        sizes="310px"
        width={310}
        height={364}
        loading="lazy"
        decoding="async"
        alt={FEATURED.alt}
        className="mt-2 aspect-[310/364] w-full rounded-3xl object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.02]"
      />
    </Link>
  )
}
