import { io, type ManagerOptions, type Socket, type SocketOptions } from 'socket.io-client'
import { env } from '@/shared/config'

const options: Partial<ManagerOptions & SocketOptions> = {
  transports: ['websocket'],
  autoConnect: false,
  withCredentials: true,
}

let instance: Socket | undefined

export function getSocket(): Socket {
  instance ??= env.SOCKET_URL ? io(env.SOCKET_URL, options) : io(options)
  return instance
}
