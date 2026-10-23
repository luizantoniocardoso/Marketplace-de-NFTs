import { http, HttpResponse } from 'msw'
import { env } from '@/shared/config'
import type { FavoritesDto } from '@/shared/contracts'
import { db } from '../db'
import { isScenario } from '../scenarios'
import { apiError, authenticate, findNft, noContent, simulateNetwork } from '../services'

function failMutation() {
  return isScenario('favorites-error') ? apiError('UNAVAILABLE', 'Não foi possível atualizar seus favoritos agora.') : null
}

export const favoriteHandlers = [
  http.get(`${env.API_URL}/favorites`, async ({ request }) => {
    const failure = await simulateNetwork()
    if (failure) return failure
    const auth = authenticate(request)
    if (auth.error) return auth.error
    return HttpResponse.json<FavoritesDto>({ nftIds: db.data.favorites[auth.user.id] ?? [] })
  }),

  http.put(`${env.API_URL}/favorites/:nftId`, async ({ request, params }) => {
    const failure = await simulateNetwork()
    if (failure) return failure
    const auth = authenticate(request)
    if (auth.error) return auth.error
    const nftId = String(params.nftId)
    if (!findNft(nftId)) return apiError('NOT_FOUND', 'Este NFT não existe.')
    const scenarioFailure = failMutation()
    if (scenarioFailure) return scenarioFailure
    const current = db.data.favorites[auth.user.id] ?? []
    if (!current.includes(nftId)) db.data.favorites[auth.user.id] = [...current, nftId]
    db.persist()
    return noContent()
  }),

  http.delete(`${env.API_URL}/favorites/:nftId`, async ({ request, params }) => {
    const failure = await simulateNetwork()
    if (failure) return failure
    const auth = authenticate(request)
    if (auth.error) return auth.error
    const scenarioFailure = failMutation()
    if (scenarioFailure) return scenarioFailure
    db.data.favorites[auth.user.id] = (db.data.favorites[auth.user.id] ?? []).filter((id) => id !== String(params.nftId))
    db.persist()
    return noContent()
  }),
]
