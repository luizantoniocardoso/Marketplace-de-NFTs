import { Link } from '@tanstack/react-router'
import { ComingSoon, Logo, Sheet, SheetContent, SheetDescription, SheetTitle } from '@/shared/ui'
import { NAV_ITEMS } from '../model'

interface HeaderMenuProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function HeaderMenu({ open, onOpenChange }: HeaderMenuProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-72 border-border bg-surface-card">
        <SheetTitle className="px-6 pt-6 text-body">
          <Logo />
        </SheetTitle>
        <SheetDescription className="sr-only">Navegação principal</SheetDescription>
        <nav aria-label="Principal (menu)" className="px-6">
          <ul className="flex flex-col gap-4">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                {item.to ? (
                  <Link
                    to={item.to}
                    hash={item.hash}
                    onClick={() => onOpenChange(false)}
                    className="text-body-md hover:text-text-accent"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <ComingSoon className="text-body-md text-text-secondary">
                    {item.label} <span className="text-caption">(em breve)</span>
                  </ComingSoon>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
