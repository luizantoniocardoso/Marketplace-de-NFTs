import { useEffect, useRef, type RefObject } from 'react'

export function useClickOutside(
  refs: ReadonlyArray<RefObject<HTMLElement | null>>,
  onOutside: () => void,
  enabled = true,
) {
  const latest = useRef({ refs, onOutside })

  useEffect(() => {
    latest.current = { refs, onOutside }
  })

  useEffect(() => {
    if (!enabled) return
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (latest.current.refs.every((ref) => !ref.current?.contains(target))) latest.current.onOutside()
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [enabled])
}
