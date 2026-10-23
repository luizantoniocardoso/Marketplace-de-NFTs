export type ArtworkSize = 480 | 960

export function artworkUrl(artwork: string, size: ArtworkSize) {
  return `/images/nfts/${artwork}-${size}.webp`
}

export function artworkSrcSet(artwork: string) {
  return `${artworkUrl(artwork, 480)} 480w, ${artworkUrl(artwork, 960)} 960w`
}
