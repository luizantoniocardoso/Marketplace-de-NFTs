import { httpHandlers } from './http'
import { newsletterHandlers } from './newsletter'
import { nftHandlers } from './nfts'
import { socketHandlers } from './socket'

export { realtime } from './socket'

export const handlers = [...httpHandlers, ...nftHandlers, ...newsletterHandlers, ...socketHandlers]
