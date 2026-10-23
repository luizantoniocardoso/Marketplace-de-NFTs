import { authHandlers } from './auth'
import { cartHandlers } from './cart'
import { favoriteHandlers } from './favorites'
import { httpHandlers } from './http'
import { newsletterHandlers } from './newsletter'
import { nftHandlers } from './nfts'
import { orderHandlers } from './orders'
import { profileHandlers } from './profile'
import { socketHandlers } from './socket'
import { walletHandlers } from './wallets'

export const handlers = [
  ...httpHandlers,
  ...authHandlers,
  ...nftHandlers,
  ...favoriteHandlers,
  ...cartHandlers,
  ...orderHandlers,
  ...profileHandlers,
  ...walletHandlers,
  ...newsletterHandlers,
  ...socketHandlers,
]
