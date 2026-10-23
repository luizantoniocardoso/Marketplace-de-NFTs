export function toggleItem<T>(list: readonly T[] | undefined, item: T): T[] | undefined {
  const next = list?.includes(item) ? list.filter((value) => value !== item) : [...(list ?? []), item]
  return next.length ? next : undefined
}
