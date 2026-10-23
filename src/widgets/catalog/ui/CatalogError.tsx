import { AlertTriangle } from 'lucide-react'
import { StateMessage } from '@/shared/ui'

interface CatalogErrorProps {
  message: string
  onRetry: () => void
}

export function CatalogError({ message, onRetry }: CatalogErrorProps) {
  return (
    <StateMessage
      role="alert"
      className="mt-8"
      icon={AlertTriangle}
      iconClassName="text-coral"
      title="Não foi possível carregar o catálogo"
      description={message}
      action={
        <button
          type="button"
          onClick={onRetry}
          className="h-9 rounded-md bg-brand px-4 text-body-md font-bold text-ink hover:bg-brand-light"
        >
          Tentar novamente
        </button>
      }
    />
  )
}
