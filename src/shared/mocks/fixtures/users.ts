import type { UserDto } from '@/shared/contracts'

export interface MockUser extends UserDto {
  passwordSalt: string
  passwordHash: string
}

export const DEMO_PASSWORD_HINT = 'kurio123'

export function createUserFixtures(): MockUser[] {
  return [
    {
      id: 'user-001',
      username: 'novasato',
      displayName: 'Nova Sato',
      email: 'nova@kurio.dev',
      ensName: 'nova.kurio.eth',
      walletNickname: 'Reserva',
      avatarUrl: null,
      passwordSalt: 'k1-salt-7f3a',
      passwordHash: '92ef1d202455d1d4d30d6c24847babc2f77164755ae8a3037dcb3e4efc4f70dc',
    },
    {
      id: 'user-002',
      username: 'rafalima',
      displayName: 'Rafael Lima',
      email: 'rafael@kurio.dev',
      ensName: 'rafa.eth',
      walletNickname: 'Principal',
      avatarUrl: null,
      passwordSalt: 'k2-salt-91bd',
      passwordHash: '0783887d25a3ad4195391dad2bdb6a469cf4c752bee4c31a15b32f8f5d2953c4',
    },
  ]
}
