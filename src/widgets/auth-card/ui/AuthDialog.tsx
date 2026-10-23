import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/shared/ui'
import { AUTH_COPY, type AuthMode } from '../model'
import { AuthCard } from './AuthCard'

interface AuthDialogProps {
  mode: AuthMode
  onModeChange: (mode: AuthMode) => void
  onClose: () => void
}

export function AuthDialog({ mode, onModeChange, onClose }: AuthDialogProps) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="block max-h-[calc(100dvh-2rem)] w-full max-w-[500px] overflow-y-auto rounded-none border-0 bg-surface-card p-0 ring-0 sm:max-w-[500px] [&>[data-slot=dialog-close]]:top-3 [&>[data-slot=dialog-close]]:right-3 [&>[data-slot=dialog-close]]:text-brand">
        <DialogTitle className="sr-only">{AUTH_COPY[mode].title}</DialogTitle>
        <DialogDescription className="sr-only">{AUTH_COPY[mode].description}</DialogDescription>
        <AuthCard mode={mode} onModeChange={onModeChange} onSuccess={onClose} />
        <div aria-hidden="true" className="h-2.5 bg-brand" />
      </DialogContent>
    </Dialog>
  )
}
