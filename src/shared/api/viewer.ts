import { useSyncExternalStore } from 'react'

const TOKEN_KEY = 'kurio:session-token'
const VIEWER_KEY = 'kurio:viewer-id'
const CART_KEY = 'kurio:cart-id'

type Listener = () => void
const listeners = new Set<Listener>()

function read(key: string) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function write(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, value)
  } catch {
    return
  }
}

let token = read(TOKEN_KEY)
let viewerId = token ? read(VIEWER_KEY) : null

function notify() {
  listeners.forEach((listener) => listener())
}

export const viewer = {
  getToken: () => token,
  getId: () => viewerId,
  getCartId() {
    let cartId = read(CART_KEY)
    if (!cartId) {
      cartId = crypto.randomUUID()
      write(CART_KEY, cartId)
    }
    return cartId
  },
  signIn(nextToken: string, nextViewerId: string) {
    token = nextToken
    viewerId = nextViewerId
    write(TOKEN_KEY, nextToken)
    write(VIEWER_KEY, nextViewerId)
    notify()
  },
  signOut() {
    token = null
    viewerId = null
    write(TOKEN_KEY, null)
    write(VIEWER_KEY, null)
    notify()
  },
  subscribe(listener: Listener) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
}

export function useViewerId() {
  return useSyncExternalStore(viewer.subscribe, viewer.getId, () => null)
}

export function viewerScope(viewerId: string | null) {
  return viewerId ?? 'guest'
}
