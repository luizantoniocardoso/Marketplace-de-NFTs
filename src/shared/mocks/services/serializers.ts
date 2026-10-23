import type { NftDetailDto, NftImageDto, NftSummaryDto, UserDto } from '@/shared/contracts'
import { db } from '../db'
import { ARTWORKS, type MockEdition, type MockNft, type MockUser } from '../fixtures'

export function findNft(nftId: string) {
  return db.data.nfts.find((nft) => nft.id === nftId)
}

export function findEdition(nft: MockNft, editionId: string): MockEdition | undefined {
  return nft.editions.find((edition) => edition.id === editionId)
}

export function defaultEdition(nft: MockNft) {
  return findEdition(nft, nft.defaultEditionId) ?? nft.editions[0]
}

export function nftPrice(nft: MockNft): string {
  return defaultEdition(nft).priceEth
}

export function nftAvailable(nft: MockNft) {
  return nft.editions.reduce((sum, edition) => sum + edition.available, 0)
}

export function nftImage(nft: MockNft, label?: string): NftImageDto {
  const alt = `${nft.name}: ${ARTWORKS[nft.artwork].alt}`
  return {
    small: `/images/nfts/${nft.artwork}-480.webp`,
    large: `/images/nfts/${nft.artwork}-960.webp`,
    alt: label ? `${alt} (${label})` : alt,
  }
}

export function toNftSummary(nft: MockNft): NftSummaryDto {
  return {
    id: nft.id,
    name: nft.name,
    collection: nft.collection,
    network: nft.network,
    priceEth: nftPrice(nft),
    previousPriceEth: nft.previousPriceEth,
    rarity: nft.rarity,
    image: nftImage(nft),
    available: nftAvailable(nft),
    listedAt: nft.listedAt,
    version: nft.version,
  }
}

const GALLERY_LABELS = ['vista principal', 'detalhe do rosto', 'detalhe do figurino', 'detalhe dos acessórios']

export function toNftDetail(nft: MockNft): NftDetailDto {
  return {
    ...toNftSummary(nft),
    tokenId: nft.tokenId,
    description: nft.description,
    story: nft.story,
    collectionName: nft.collectionName,
    creator: nft.creator,
    attributes: nft.attributes,
    contract: { address: nft.contractAddress, standard: 'ERC-721', royaltyPercent: 5 },
    rating: nft.rating,
    reviews: nft.reviews,
    gallery: GALLERY_LABELS.map((label) => nftImage(nft, label)),
    editions: nft.editions.map((edition) => ({ ...edition })),
    defaultEditionId: nft.defaultEditionId,
  }
}

export function toUserDto(user: MockUser): UserDto {
  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    email: user.email,
    ensName: user.ensName,
    walletNickname: user.walletNickname,
    avatarUrl: user.avatarUrl,
  }
}
