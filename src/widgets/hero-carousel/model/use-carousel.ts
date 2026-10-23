import { useRef, useState, type KeyboardEvent, type TouchEvent } from 'react'

const SWIPE_THRESHOLD = 40

export function useCarousel(count: number) {
  const [index, setIndex] = useState(0)
  const touchStart = useRef<number | null>(null)

  const goTo = (next: number) => setIndex((next + count) % count)

  const handlers = {
    onKeyDown: (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') goTo(index + 1)
      if (event.key === 'ArrowLeft') goTo(index - 1)
    },
    onTouchStart: (event: TouchEvent) => {
      touchStart.current = event.touches[0].clientX
    },
    onTouchEnd: (event: TouchEvent) => {
      if (touchStart.current === null) return
      const delta = event.changedTouches[0].clientX - touchStart.current
      if (Math.abs(delta) > SWIPE_THRESHOLD) goTo(index + (delta < 0 ? 1 : -1))
      touchStart.current = null
    },
  }

  return { index, goTo, handlers }
}
