import { createNftFixtures, type MockNft } from '../fixtures'

export interface MockDatabase {
  nfts: MockNft[]
}

const STORAGE_KEY = 'kurio:mock-db'
const SCHEMA_VERSION = 1

function seed(): MockDatabase {
  return { nfts: createNftFixtures() }
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
  persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: SCHEMA_VERSION, data: state }))
    } catch {
    }
  },
  reset() {
    state = seed()
    this.persist()
  },
}
