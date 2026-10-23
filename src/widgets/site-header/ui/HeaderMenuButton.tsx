import { Menu } from 'lucide-react'
import { lazy, Suspense, useState } from 'react'

const HeaderMenu = lazy(() => import('./HeaderMenu'))

export function HeaderMenuButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        aria-label="Abrir menu"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="grid size-9 place-items-center rounded-md text-foreground hover:text-text-accent lg:hidden"
      >
        <Menu className="size-6" aria-hidden="true" />
      </button>
      {open && (
        <Suspense>
          <HeaderMenu open={open} onOpenChange={setOpen} />
        </Suspense>
      )}
    </>
  )
}
