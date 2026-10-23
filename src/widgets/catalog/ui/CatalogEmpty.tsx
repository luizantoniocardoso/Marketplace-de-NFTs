import { SearchX } from 'lucide-react'
import { StateMessage } from '@/shared/ui'

interface CatalogEmptyProps {
  filtered: boolean
  onClearFilters: () => void
}

export function CatalogEmpty({ filtered, onClearFilters }: CatalogEmptyProps) {
  return (
    <StateMessage
      className="mt-8"
      icon={SearchX}
      title="Nenhum NFT encontrado"
      description={filtered ? 'Tente ajustar a busca ou remover alguns filtros.' : 'O catálogo está vazio no momento.'}
      action={
        filtered && (
          <button
            type="button"
            onClick={onClearFilters}
            className="h-9 rounded-md border border-brand px-4 text-body-md font-bold text-text-accent hover:bg-brand hover:text-ink"
          >
            Limpar filtros
          </button>
        )
      }
    />
  )
}
