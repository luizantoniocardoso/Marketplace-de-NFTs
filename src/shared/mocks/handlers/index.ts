import { httpHandlers } from './http'
import { socketHandlers } from './socket'

export { realtime } from './socket'

export const handlers = [...httpHandlers, ...socketHandlers]
