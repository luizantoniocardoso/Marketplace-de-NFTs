import { cn } from '@/shared/lib'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

interface ScrollCarouselProps {
  label: string
  children: ReactNode
  className?: string
  listClassName?: string
}

function ScrollCarousel({ label, children, className, listClassName }: ScrollCarouselProps) {
  const listRef = useRef<HTMLUListElement>(null)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(0)

  const measure = useCallback(() => {
    const list = listRef.current
    if (!list) return
    const total = Math.max(1, Math.ceil(list.scrollWidth / list.clientWidth - 0.05))
    setPages(total)
    setPage(Math.min(total - 1, Math.round(list.scrollLeft / list.clientWidth)))
  }, [])

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(list)
    const mutations = new MutationObserver(measure)
    mutations.observe(list, { childList: true })
    list.addEventListener('scroll', measure, { passive: true })
    return () => {
      observer.disconnect()
      mutations.disconnect()
      list.removeEventListener('scroll', measure)
    }
  }, [measure])

  const goTo = (index: number) => {
    const list = listRef.current
    if (!list) return
    list.scrollTo({ left: index * list.clientWidth, behavior: 'smooth' })
  }

  return (
    <div
      data-slot="scroll-carousel"
      role="region"
      aria-roledescription="carrossel"
      aria-label={label}
      className={className}
    >
      <ul
        ref={listRef}
        className={cn(
          'flex snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto scroll-smooth md:gap-[25px] [&::-webkit-scrollbar]:hidden',
          listClassName,
        )}
      >
        {children}
      </ul>
      {pages > 1 && (
        <div role="group" aria-label={`Páginas de ${label}`} className="mt-6 flex justify-center">
          {Array.from({ length: pages }, (_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Página ${index + 1} de ${pages}`}
              aria-current={index === page ? 'true' : undefined}
              onClick={() => goTo(index)}
              className="grid size-6 place-items-center"
            >
              <span
                className={cn(
                  'size-3 rounded-full border border-brand transition-colors',
                  index === page ? 'bg-brand' : 'bg-transparent',
                )}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export { ScrollCarousel }
