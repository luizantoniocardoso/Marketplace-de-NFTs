export const AUTH_MODES = ['login', 'register'] as const
export type AuthMode = (typeof AUTH_MODES)[number]

export const AUTH_COPY: Record<AuthMode, { tab: string; title: string; description: string }> = {
  login: {
    tab: 'Entrar',
    title: 'Entrar',
    description: 'Entre para gerenciar sua carteira, coleção e perfil de criador.',
  },
  register: {
    tab: 'Criar conta',
    title: 'Criar perfil de colecionador',
    description: 'Crie seu perfil de colecionador e conecte uma carteira quando quiser.',
  },
}
