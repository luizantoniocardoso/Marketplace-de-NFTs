export interface MockCoupon {
  code: string
  description: string
  percentOff: number
  expiresAt: string
}

export const COUPONS: MockCoupon[] = [
  {
    code: 'KURIO10',
    description: '10% de desconto no lançamento',
    percentOff: 10,
    expiresAt: '2099-12-31T23:59:59.000Z',
  },
  {
    code: 'GENESIS5',
    description: '5% de desconto para colecionadores gênesis',
    percentOff: 5,
    expiresAt: '2099-12-31T23:59:59.000Z',
  },
  {
    code: 'EXPIRADO',
    description: '15% de desconto de pré-venda',
    percentOff: 15,
    expiresAt: '2025-01-31T23:59:59.000Z',
  },
]
