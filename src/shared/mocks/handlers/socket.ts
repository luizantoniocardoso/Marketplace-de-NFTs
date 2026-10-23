import { toSocketIo } from '@mswjs/socket.io-binding'
import { ws } from 'msw'

export const realtime = ws.link(/\/socket\.io\//)

export const socketHandlers = [
  realtime.addEventListener('connection', (connection) => {
    toSocketIo(connection)
  }),
]
