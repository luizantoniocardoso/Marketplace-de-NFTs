import { Search, X } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { SearchField } from '@/features/search-nfts'
import { useClickOutside } from '@/shared/lib'
import { useHeaderSearch } from '../model'

const PANEL_ID = 'header-search'

export function HeaderSearch() {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const { query, search } = useHeaderSearch()

  const close = useCallback(() => setOpen(false), [])
  useClickOutside([buttonRef, panelRef], close, open)

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={PANEL_ID}
        aria-label={open ? 'Fechar busca' : 'Abrir busca'}
        onClick={() => setOpen((value) => !value)}
        className="grid size-9 place-items-center rounded-md text-foreground hover:text-text-accent"
      >
        {open ? <X className="size-6" aria-hidden="true" /> : <Search className="size-6" aria-hidden="true" />}
      </button>

      {open && (
        <div ref={panelRef} id={PANEL_ID} className="page-container absolute inset-x-0 top-[68px]">
          <div
            className="ml-auto w-full max-w-sm rounded-b-lg border border-t-0 border-border bg-surface-card p-3 shadow-xl"
            onKeyDown={(event) => {
              if (event.key !== 'Escape') return
              close()
              buttonRef.current?.focus()
            }}
          >
            <SearchField value={query} onSearch={search} autoFocus className="bg-ink" />
          </div>
        </div>
      )}
    </>
  )
}
