import { toSocketIo } from '@mswjs/socket.io-binding'
import { ws } from 'msw'
import { registerClient } from '../services'

const ENGINE_IO_PING = '2'
const PING_INTERVAL_MS = 20_000

export const realtime = ws.link(/\/realtime\/?$/)

export const socketHandlers = [
  realtime.addEventListener('connection', (connection) => {
    const io = toSocketIo(connection)
    const unregister = registerClient(io, () => connection.client.close(4000, 'Conexão encerrada pelo servidor simulado'))
    const ping = setInterval(() => connection.client.send(ENGINE_IO_PING), PING_INTERVAL_MS)
    connection.client.addEventListener('close', () => {
      clearInterval(ping)
      unregister()
    })
  }),
]
