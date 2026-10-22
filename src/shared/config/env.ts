export const env = {
  API_URL: import.meta.env.VITE_API_URL || '/api',
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || undefined,
  ENABLE_MOCKS: import.meta.env.VITE_ENABLE_MOCKS === 'true',
} as const
