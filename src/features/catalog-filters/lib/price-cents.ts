import { formatEth } from '@/shared/lib'

export const toCents = (eth: string) => Math.round(Number(eth) * 100)

export const fromCents = (cents: number) => (cents / 100).toFixed(2)

export function formatPriceRange(fromCentsValue: number, toCentsValue: number) {
  const from = formatEth(fromCents(fromCentsValue), { unit: false })
  const to = formatEth(fromCents(toCentsValue))
  return `${from} - ${to}`.replaceAll('.', ',')
}
