import { delay, http, HttpResponse } from 'msw'
import { env } from '@/shared/config'
import { API_HEADERS, type CreateOrderRequest, type OrderDto } from '@/shared/contracts'
import { isScenario, ORDER_TIMEOUT_DELAY_MS } from '../scenarios'
import {
  apiError,
  authenticate,
  createOrder,
  findUserOrder,
  readJson,
  settleDueOrder,
  simulateNetwork,
  toOrderDto,
} from '../services'

const IDEMPOTENCY_KEY = /^[A-Za-z0-9-]{16,64}$/

export const orderHandlers = [
  http.post(`${env.API_URL}/orders`, async ({ request }) => {
    const failure = await simulateNetwork()
    if (failure) return failure
    const auth = authenticate(request)
    if (auth.error) return auth.error
    const key = request.headers.get(API_HEADERS.idempotencyKey)
    if (!key || !IDEMPOTENCY_KEY.test(key)) {
      return apiError('VALIDATION_ERROR', 'Chave de idempotência ausente ou inválida.')
    }
    const body = await readJson<CreateOrderRequest>(request)
    const result = createOrder(auth.user, body, key)
    if (result.error) return result.error
    if (!result.replayed && isScenario('order-timeout')) await delay(ORDER_TIMEOUT_DELAY_MS)
    return HttpResponse.json<OrderDto>(toOrderDto(result.order), { status: result.replayed ? 200 : 201 })
  }),

  http.get(`${env.API_URL}/orders/:orderId`, async ({ request, params }) => {
    const failure = await simulateNetwork()
    if (failure) return failure
    const auth = authenticate(request)
    if (auth.error) return auth.error
    const order = findUserOrder(auth.user.id, String(params.orderId))
    if (!order) return apiError('NOT_FOUND', 'Pedido não encontrado.')
    return HttpResponse.json<OrderDto>(toOrderDto(settleDueOrder(order)))
  }),
]
