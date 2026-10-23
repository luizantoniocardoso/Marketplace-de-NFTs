import { ScanLine } from 'lucide-react'
import { useFocusSearch } from '../model'

export function SearchFab() {
  const focusSearch = useFocusSearch()

  return (
    <button
      type="button"
      onClick={focusSearch}
      aria-label="Buscar NFTs"
      className="-mt-16 grid size-16 place-items-center rounded-full bg-gradient-to-b from-brand-light to-brand-dark text-foreground shadow-lg shadow-black/40"
    >
      <ScanLine className="size-7" aria-hidden="true" />
    </button>
  )
}
