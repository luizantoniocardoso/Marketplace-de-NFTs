import { Link } from '@tanstack/react-router'
import { AlertTriangle, SearchX } from 'lucide-react'
import { getApiError } from '@/shared/api'
import { Button, MobileTopBar, StateMessage } from '@/shared/ui'

interface NftDetailsErrorProps {
  error: unknown
  onRetry: () => void
  onBack: () => void
}

export function NftDetailsError({ error, onRetry, onBack }: NftDetailsErrorProps) {
  const apiError = getApiError(error)
  const notFound = apiError.code === 'NOT_FOUND'

  return (
    <div className="page-container pt-6 pb-24 md:pt-16">
      <MobileTopBar onBack={onBack} />
      {notFound ? (
        <StateMessage
          className="mt-6"
          icon={SearchX}
          title={<h1>NFT não encontrado</h1>}
          description="Este NFT não existe ou foi removido do mercado. Confira outros itens disponíveis no catálogo."
          action={
            <Button asChild variant="brand" size="md">
              <Link to="/">Voltar ao catálogo</Link>
            </Button>
          }
        />
      ) : (
        <StateMessage
          role="alert"
          className="mt-6"
          icon={AlertTriangle}
          iconClassName="text-coral"
          title={<h1>Não foi possível carregar este NFT</h1>}
          description={apiError.message}
          action={
            <Button variant="brand" size="md" onClick={onRetry}>
              Tentar novamente
            </Button>
          }
        />
      )}
    </div>
  )
}
