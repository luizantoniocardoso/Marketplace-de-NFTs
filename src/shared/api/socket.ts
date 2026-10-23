import type { ManagerOptions, Socket, SocketOptions } from 'socket.io-client'
import { env, REALTIME_PATH } from '@/shared/config'
import { REALTIME_EVENTS, type SessionJoinPayload } from '@/shared/contracts'
import { viewer } from './viewer'

const options: Partial<ManagerOptions & SocketOptions> = {
  path: REALTIME_PATH,
  transports: ['websocket'],
  autoConnect: false,
  withCredentials: true,
  reconnectionDelay: 500,
  reconnectionDelayMax: 4000,
}

let instance: Promise<Socket> | undefined
let current: Socket | undefined

function joinCurrentSession(socket: Socket) {
  const token = viewer.getToken()
  if (!token) {
    socket.emit(REALTIME_EVENTS.sessionLeave)
    return
  }
  const payload: SessionJoinPayload = { token }
  socket.emit(REALTIME_EVENTS.sessionJoin, payload)
}

export function loadSocket(): Promise<Socket> {
  instance ??= import('socket.io-client').then(({ io }) => {
    const socket = env.SOCKET_URL ? io(env.SOCKET_URL, options) : io(options)
    socket.on('connect', () => joinCurrentSession(socket))
    current = socket
    return socket
  })
  return instance
}

export function syncSocketSession() {
  if (current?.connected) joinCurrentSession(current)
}
