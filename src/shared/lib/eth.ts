const DECIMALS = 18
const SCALE = 10n ** BigInt(DECIMALS)
const DECIMAL_PATTERN = /^\d+(\.\d{1,18})?$/

export function isEthAmount(value: string): boolean {
  return DECIMAL_PATTERN.test(value)
}

export function parseEth(value: string): bigint {
  if (!isEthAmount(value)) throw new Error(`Valor ETH inválido: "${value}"`)
  const [whole, fraction = ''] = value.split('.')
  return BigInt(whole) * SCALE + BigInt(fraction.padEnd(DECIMALS, '0'))
}

export function toEthString(wei: bigint): string {
  const sign = wei < 0n ? '-' : ''
  const abs = wei < 0n ? -wei : wei
  const whole = abs / SCALE
  const fraction = (abs % SCALE).toString().padStart(DECIMALS, '0').replace(/0+$/, '')
  return `${sign}${whole}${fraction ? `.${fraction}` : ''}`
}

export function addEth(...values: string[]): string {
  return toEthString(values.reduce((sum, v) => sum + parseEth(v), 0n))
}

export function subtractEth(a: string, b: string): string {
  return toEthString(parseEth(a) - parseEth(b))
}

export function multiplyEth(value: string, quantity: number): string {
  if (!Number.isInteger(quantity)) throw new Error('Quantidade deve ser inteira')
  return toEthString(parseEth(value) * BigInt(quantity))
}

export function compareEth(a: string, b: string): number {
  const diff = parseEth(a) - parseEth(b)
  return diff === 0n ? 0 : diff > 0n ? 1 : -1
}

export function formatEth(value: string, { minDecimals = 2, maxDecimals = 4, unit = true } = {}): string {
  const [whole, fraction = ''] = toEthString(parseEth(value)).split('.')
  let digits = fraction.slice(0, maxDecimals)
  if (fraction.length > maxDecimals && Number(fraction[maxDecimals]) >= 5) {
    const rounded = toEthString(parseEth(`${whole}.${digits || '0'}`) + 10n ** BigInt(DECIMALS - maxDecimals))
    return formatEth(rounded, { minDecimals, maxDecimals, unit })
  }
  digits = digits.replace(/0+$/, '').padEnd(minDecimals, '0')
  const amount = digits ? `${whole}.${digits}` : whole
  return unit ? `${amount} ETH` : amount
}
