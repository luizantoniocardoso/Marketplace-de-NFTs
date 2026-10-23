import { http } from '@/shared/api'
import type {
  ConnectWalletRequest,
  UpsertWalletRequest,
  WalletConnectionDto,
  WalletDto,
  WalletSlot,
} from '@/shared/contracts'

export async function fetchWallets(signal?: AbortSignal) {
  const { data } = await http.get<WalletDto[]>('/wallets', { signal })
  return data
}

export async function saveWallet(slot: WalletSlot, body: UpsertWalletRequest) {
  const { data } = await http.put<WalletDto>(`/wallets/${slot}`, body)
  return data
}

export async function fetchWalletConnection(signal?: AbortSignal) {
  const { data } = await http.get<{ connection: WalletConnectionDto | null }>('/wallet-connection', { signal })
  return data.connection
}

export async function connectWallet(body: ConnectWalletRequest) {
  const { data } = await http.post<{ connection: WalletConnectionDto }>('/wallet-connection', body)
  return data.connection
}

export async function disconnectWallet() {
  await http.delete('/wallet-connection')
}
