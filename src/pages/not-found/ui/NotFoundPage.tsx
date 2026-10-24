import { Link } from '@tanstack/react-router'
import { Compass } from 'lucide-react'
import { useDocumentTitle } from '@/shared/lib'
import { Button, StateMessage } from '@/shared/ui'

export function NotFoundPage() {
  useDocumentTitle('Página não encontrada')

  return (
    <div className="page-container py-16 md:py-24">
      <StateMessage
        icon={Compass}
        title={<h1>Página não encontrada</h1>}
        description="O endereço acessado não existe ou foi movido. Volte ao início para continuar explorando."
        action={
          <Button asChild variant="brand" size="md">
            <Link to="/">Voltar ao início</Link>
          </Button>
        }
      />
    </div>
  )
}
