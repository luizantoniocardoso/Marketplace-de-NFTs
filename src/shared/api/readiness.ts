let ready: Promise<void> = Promise.resolve()

export function deferRequestsUntil(promise: Promise<unknown>) {
  ready = promise.then(
    () => undefined,
    () => undefined,
  )
}

export function whenApiReady() {
  return ready
}
