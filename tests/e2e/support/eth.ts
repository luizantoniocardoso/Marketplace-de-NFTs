const SCALE = 10n ** 18n

export function toWei(value: string) {
  const [whole, fraction = ''] = value.split('.')
  return BigInt(whole) * SCALE + BigInt(fraction.padEnd(18, '0').slice(0, 18))
}

export function fromWei(wei: bigint) {
  const whole = wei / SCALE
  const fraction = (wei % SCALE).toString().padStart(18, '0').replace(/0+$/, '')
  return fraction ? `${whole}.${fraction}` : `${whole}`
}

export function formatEth(value: string, { unit = true } = {}) {
  const wei = toWei(value)
  const step = 10n ** 14n
  const rounded = ((wei + step / 2n) / step) * step
  const [whole, fraction = ''] = fromWei(rounded).split('.')
  const amount = `${whole}.${fraction.slice(0, 4).padEnd(2, '0')}`
  return unit ? `${amount} ETH` : amount
}
