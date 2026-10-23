import type { WalletDto } from '@/shared/contracts'

export interface MockWallet extends WalletDto {
  userId: string
}

const UPDATED_AT = '2026-09-01T12:00:00.000Z'

export function createWalletFixtures(): MockWallet[] {
  return [
    {
      id: 'wallet-001',
      userId: 'user-001',
      slot: 'primary',
      displayName: 'Nova Sato',
      nickname: 'Principal',
      network: 'ethereum',
      profileName: 'novasato',
      address: '0xA91F3c6D2b8E4f7A1c5D9e0B3a6F2d8C4e1BE82C',
      secondaryAddress: null,
      provider: 'metamask',
      referralCode: 'KURIO-NOVA',
      email: 'nova@kurio.dev',
      ensName: 'nova.eth',
      updatedAt: UPDATED_AT,
    },
    {
      id: 'wallet-002',
      userId: 'user-001',
      slot: 'secondary',
      displayName: 'Nova Sato',
      nickname: 'Reserva',
      network: 'polygon',
      profileName: 'novasato',
      address: '0x5b2E9a71C04dF3e8B6a1D7c9E2f4A8b03C6d1F9e',
      secondaryAddress: null,
      provider: 'coinbase',
      referralCode: 'KURIO-NOVA',
      email: 'nova@kurio.dev',
      ensName: 'nova.kurio.eth',
      updatedAt: UPDATED_AT,
    },
    {
      id: 'wallet-003',
      userId: 'user-002',
      slot: 'primary',
      displayName: 'Rafael Lima',
      nickname: 'Principal',
      network: 'ethereum',
      profileName: 'rafalima',
      address: '0x3D7a1E9c4B2f8A6d0C5e7B1a9F3c2D8e6A4b7C10',
      secondaryAddress: null,
      provider: 'walletconnect',
      referralCode: 'KURIO-RAFA',
      email: 'rafael@kurio.dev',
      ensName: 'rafa.eth',
      updatedAt: UPDATED_AT,
    },
  ]
}
