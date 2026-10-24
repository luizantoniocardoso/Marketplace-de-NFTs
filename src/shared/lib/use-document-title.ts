import { useEffect } from 'react'

const APP_NAME = 'Kurio'
const DEFAULT_TITLE = `${APP_NAME} — Marketplace de NFTs`

export function useDocumentTitle(title?: string | null) {
  useEffect(() => {
    document.title = title ? `${title} | ${APP_NAME}` : DEFAULT_TITLE
  }, [title])
}
