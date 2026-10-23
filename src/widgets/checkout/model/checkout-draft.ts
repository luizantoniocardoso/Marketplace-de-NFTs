import type { CheckoutValues } from './checkout-schema'

export interface CheckoutDraft {
  walletId: string | null
  values: CheckoutValues
  note: string
}

const key = (viewerId: string | null) => `kurio:checkout-draft:${viewerId ?? 'anonymous'}`

export function readCheckoutDraft(viewerId: string | null): CheckoutDraft | null {
  try {
    const raw = sessionStorage.getItem(key(viewerId))
    return raw ? (JSON.parse(raw) as CheckoutDraft) : null
  } catch {
    return null
  }
}

export function writeCheckoutDraft(viewerId: string | null, draft: CheckoutDraft) {
  try {
    sessionStorage.setItem(key(viewerId), JSON.stringify(draft))
  } catch {
    return
  }
}

export function clearCheckoutDraft(viewerId: string | null) {
  try {
    sessionStorage.removeItem(key(viewerId))
  } catch {
    return
  }
}
