import { toSocketIo } from '@mswjs/socket.io-binding'
import { ws } from 'msw'

// Casa com qualquer origem: o socket.io-client conecta em <origem>/socket.io/?EIO=4&transport=websocket
export const realtime = ws.link(/\/socket\.io\//)

export const socketHandlers = [
  realtime.addEventListener('connection', (connection) => {
    toSocketIo(connection)
  }),
]
