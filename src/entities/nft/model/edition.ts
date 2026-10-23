import type { NftEditionDto } from '@/shared/contracts'

export function editionLimit(edition: Pick<NftEditionDto, 'available' | 'maxPerOrder'>) {
  return Math.max(0, Math.min(edition.available, edition.maxPerOrder))
}

export function pickInitialEdition(editions: NftEditionDto[], defaultEditionId: string) {
  const preferred = editions.find((edition) => edition.id === defaultEditionId)
  if (preferred && preferred.available > 0) return preferred
  return editions.find((edition) => edition.available > 0) ?? preferred ?? editions[0]
}
