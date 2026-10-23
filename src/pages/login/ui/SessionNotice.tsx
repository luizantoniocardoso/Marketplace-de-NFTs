import { Clock } from 'lucide-react'

export function SessionNotice() {
  return (
    <p role="status" className="mb-4 flex items-start gap-2 rounded-[4px] border border-brand/50 bg-brand/10 px-3 py-2 text-caption text-foreground">
      <Clock className="mt-0.5 size-4 shrink-0 text-text-accent" aria-hidden="true" />
      Sua sessão expirou. Entre novamente para continuar de onde parou.
    </p>
  )
}
