interface CatalogStatusProps {
  isPending: boolean
  isUpdating: boolean
  total?: number
}

function statusMessage({ isPending, isUpdating, total }: CatalogStatusProps) {
  if (isPending) return 'Carregando NFTs'
  if (isUpdating) return 'Atualizando resultados'
  if (total !== undefined) return `${total} NFTs encontrados`
  return ''
}

export function CatalogStatus(props: CatalogStatusProps) {
  return (
    <p className="sr-only" role="status" aria-live="polite">
      {statusMessage(props)}
    </p>
  )
}
