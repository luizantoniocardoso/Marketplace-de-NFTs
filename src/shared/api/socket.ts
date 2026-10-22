import { io, type ManagerOptions, type SocketOptions } from 'socket.io-client'
import { env } from '@/shared/config'

const options: Partial<ManagerOptions & SocketOptions> = {
  // O binding do MSW intercepta apenas WebSocket, então o long-polling fica desativado.
  transports: ['websocket'],
  autoConnect: false,
  withCredentials: true,
}

export const socket = env.SOCKET_URL ? io(env.SOCKET_URL, options) : io(options)
