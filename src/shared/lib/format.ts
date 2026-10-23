const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

export function shortenAddress(address: string, visible = 4) {
  if (address.length <= visible * 2 + 4) return address
  const prefix = address.startsWith('0x') ? address.slice(0, visible + 2) : address.slice(0, visible)
  return `${prefix}…${address.slice(-visible)}`
}

export function formatShortDate(iso: string) {
  const date = new Date(iso)
  return `${date.getDate()} ${MONTHS[date.getMonth()]}, ${date.getFullYear()}`
}

export function pluralize(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`
}

export function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export function createIdempotencyKey() {
  return crypto.randomUUID()
}
