import { delay, http, HttpResponse } from 'msw'
import { env } from '@/shared/config'
import {
  NFT_NETWORKS,
  WALLET_PROVIDERS,
  WALLET_SLOTS,
  type ConnectWalletRequest,
  type UpsertWalletRequest,
  type WalletConnectionDto,
  type WalletDto,
  type WalletSlot,
} from '@/shared/contracts'
import { db } from '../db'
import type { MockWallet } from '../fixtures'
import { isScenario } from '../scenarios'
import { apiError, authenticate, noContent, readJson, simulateNetwork, validateWallet } from '../services'

const CONNECTION_DELAY_MS = 600

function toWalletDto({ userId: _userId, ...wallet }: MockWallet): WalletDto {
  return wallet
}

export const walletHandlers = [
  http.get(`${env.API_URL}/wallets`, async ({ request }) => {
    const failure = await simulateNetwork()
    if (failure) return failure
    const auth = authenticate(request)
    if (auth.error) return auth.error
    const wallets = db.data.wallets.filter((wallet) => wallet.userId === auth.user.id).map(toWalletDto)
    return HttpResponse.json<WalletDto[]>(
      wallets.sort((a, b) => WALLET_SLOTS.indexOf(a.slot) - WALLET_SLOTS.indexOf(b.slot)),
    )
  }),

  http.put(`${env.API_URL}/wallets/:slot`, async ({ request, params }) => {
    const failure = await simulateNetwork()
    if (failure) return failure
    const auth = authenticate(request)
    if (auth.error) return auth.error
    const slot = String(params.slot) as WalletSlot
    if (!WALLET_SLOTS.includes(slot)) return apiError('NOT_FOUND', 'Tipo de carteira inexistente.')
    const body = await readJson<UpsertWalletRequest>(request)
    const fields = validateWallet(body)
    if (Object.keys(fields).length) return apiError('VALIDATION_ERROR', 'Revise os campos destacados.', fields)

    const owned = db.data.wallets.filter((wallet) => wallet.userId === auth.user.id)
    if (slot === 'secondary' && !owned.some((wallet) => wallet.slot === 'primary')) {
      return apiError('CONFLICT', 'Cadastre a carteira principal antes da secundária.')
    }
    const duplicate = owned.find(
      (wallet) => wallet.slot !== slot && wallet.address.toLowerCase() === body.address!.trim().toLowerCase(),
    )
    if (duplicate && slot === 'primary') {
      return apiError('CONFLICT', 'Este endereço já está cadastrado na carteira secundária.', {
        address: 'Endereço já usado na outra carteira.',
      })
    }

    const data = {
      displayName: body.displayName!.trim(),
      nickname: body.nickname!.trim(),
      network: body.network!,
      profileName: body.profileName!.trim(),
      address: body.address!.trim(),
      secondaryAddress: body.secondaryAddress?.trim() || null,
      provider: body.provider!,
      referralCode: body.referralCode!.trim(),
      email: body.email!.trim().toLowerCase(),
      ensName: body.ensName!,
      updatedAt: new Date().toISOString(),
    }
    const existing = owned.find((wallet) => wallet.slot === slot)
    if (existing) Object.assign(existing, data)
    else db.data.wallets.push({ id: db.nextId('wallet'), userId: auth.user.id, slot, ...data })
    db.persist()
    const saved = db.data.wallets.find((wallet) => wallet.userId === auth.user.id && wallet.slot === slot)!
    return HttpResponse.json<WalletDto>(toWalletDto(saved), { status: existing ? 200 : 201 })
  }),

  http.get(`${env.API_URL}/wallet-connection`, async ({ request }) => {
    const failure = await simulateNetwork()
    if (failure) return failure
    const auth = authenticate(request)
    if (auth.error) return auth.error
    return HttpResponse.json<{ connection: WalletConnectionDto | null }>({
      connection: db.data.connections[auth.user.id] ?? null,
    })
  }),

  http.post(`${env.API_URL}/wallet-connection`, async ({ request }) => {
    const failure = await simulateNetwork()
    if (failure) return failure
    const auth = authenticate(request)
    if (auth.error) return auth.error
    const body = await readJson<ConnectWalletRequest>(request)
    const wallet = db.data.wallets.find((item) => item.id === body.walletId && item.userId === auth.user.id)
    if (!wallet) return apiError('NOT_FOUND', 'Carteira não encontrada.')
    if (!body.provider || !WALLET_PROVIDERS.includes(body.provider))
      return apiError('VALIDATION_ERROR', 'Selecione o tipo de carteira.')
    if (!body.network || !NFT_NETWORKS.includes(body.network)) return apiError('VALIDATION_ERROR', 'Selecione a rede.')
    await delay(CONNECTION_DELAY_MS)
    if (isScenario('wallet-rejected')) return apiError('WALLET_REJECTED', 'A conexão foi recusada na carteira.')
    const connection: WalletConnectionDto = {
      walletId: wallet.id,
      provider: body.provider,
      network: body.network,
      address: wallet.address,
      connectedAt: new Date().toISOString(),
    }
    db.data.connections[auth.user.id] = connection
    db.persist()
    return HttpResponse.json<{ connection: WalletConnectionDto }>({ connection })
  }),

  http.delete(`${env.API_URL}/wallet-connection`, async ({ request }) => {
    const failure = await simulateNetwork()
    if (failure) return failure
    const auth = authenticate(request)
    if (auth.error) return auth.error
    db.data.connections[auth.user.id] = null
    db.persist()
    return noContent()
  }),
]
