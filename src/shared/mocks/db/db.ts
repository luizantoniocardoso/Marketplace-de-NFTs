import type { OrderDto, WalletConnectionDto } from '@/shared/contracts'
import {
  createNftFixtures,
  createUserFixtures,
  createWalletFixtures,
  type MockNft,
  type MockUser,
  type MockWallet,
} from '../fixtures'

export interface MockSession {
  token: string
  userId: string
  expiresAt: string
}

export interface MockCartItem {
  id: string
  nftId: string
  editionId: string
  quantity: number
  addedPriceEth: string
}

export interface MockCart {
  items: MockCartItem[]
  couponCode: string | null
  updatedAt: string
}

export interface MockOrder extends OrderDto {
  userId: string
  idempotencyKey: string
  requestHash: string
  settleAt: string
  outcome: 'confirmed' | 'declined'
}

export interface MockDatabase {
  nfts: MockNft[]
  users: MockUser[]
  sessions: MockSession[]
  carts: Record<string, MockCart>
  favorites: Record<string, string[]>
  wallets: MockWallet[]
  connections: Record<string, WalletConnectionDto | null>
  orders: MockOrder[]
  sequence: number
}

const STORAGE_KEY = 'kurio:mock-db'
const SCHEMA_VERSION = 2

function seed(): MockDatabase {
  return {
    nfts: createNftFixtures(),
    users: createUserFixtures(),
    sessions: [],
    carts: {},
    favorites: { 'user-001': ['nft-002', 'nft-006'] },
    wallets: createWalletFixtures(),
    connections: {},
    orders: [],
    sequence: 1000,
  }
}

function load(): MockDatabase | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { version: number; data: MockDatabase }
    return parsed.version === SCHEMA_VERSION ? parsed.data : null
  } catch {
    return null
  }
}

let state: MockDatabase = load() ?? seed()

export const db = {
  get data(): MockDatabase {
    return state
  },
  nextId(prefix: string) {
    state.sequence += 1
    return `${prefix}-${state.sequence}`
  },
  persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: SCHEMA_VERSION, data: state }))
    } catch {
      return
    }
  },
  reset() {
    state = seed()
    this.persist()
  },
}
