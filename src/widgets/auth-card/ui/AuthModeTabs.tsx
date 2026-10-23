import { cn } from '@/shared/lib'
import { AUTH_COPY, AUTH_MODES, type AuthMode } from '../model'

interface AuthModeTabsProps {
  mode: AuthMode
  onModeChange: (mode: AuthMode) => void
}

const MODES = AUTH_MODES

export function AuthModeTabs({ mode, onModeChange }: AuthModeTabsProps) {
  return (
    <div role="group" aria-label="Escolha como continuar" className="flex items-center justify-center text-title">
      {MODES.map((item, index) => (
        <span key={item} className="flex items-center">
          {index > 0 && <span aria-hidden="true" className="mx-1.5 h-6 w-px bg-brand" />}
          <button
            type="button"
            aria-pressed={mode === item}
            onClick={() => onModeChange(item)}
            className={cn('transition-colors hover:text-text-accent', mode === item ? 'text-text-accent' : 'text-foreground')}
          >
            {AUTH_COPY[item].tab}
          </button>
        </span>
      ))}
    </div>
  )
}
