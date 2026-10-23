import { useEffect, useRef, useState } from 'react'

const DEBOUNCE_MS = 300

export function useDebouncedSearch(value: string, onSearch: (term: string) => void) {
  const [draft, setDraft] = useState(value)
  const lastSent = useRef(value)

  useEffect(() => {
    if (value !== lastSent.current) {
      lastSent.current = value
      setDraft(value)
    }
  }, [value])

  useEffect(() => {
    const term = draft.trim()
    if (term === lastSent.current.trim()) return
    const timer = setTimeout(() => {
      lastSent.current = term
      onSearch(term)
    }, DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [draft, onSearch])

  const submit = () => {
    const term = draft.trim()
    lastSent.current = term
    onSearch(term)
  }

  return { draft, setDraft, submit }
}
