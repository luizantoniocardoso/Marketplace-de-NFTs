import { Search } from 'lucide-react'
import { useId, type ComponentProps } from 'react'
import { cn } from '@/shared/lib'
import { useDebouncedSearch } from '../model'

interface SearchFieldProps extends Omit<ComponentProps<'input'>, 'value' | 'onChange' | 'defaultValue'> {
  value: string
  onSearch: (term: string) => void
  label?: string
  formClassName?: string
}

export function SearchField({
  value,
  onSearch,
  label = 'Buscar NFTs',
  placeholder = 'Explorar coleções',
  formClassName,
  className,
  id,
  ...inputProps
}: SearchFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const { draft, setDraft, submit } = useDebouncedSearch(value, onSearch)

  return (
    <form
      role="search"
      className={cn('relative flex items-center', formClassName)}
      onSubmit={(event) => {
        event.preventDefault()
        submit()
      }}
    >
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <Search aria-hidden="true" className="pointer-events-none absolute left-3 size-5 text-text-secondary" />
      <input
        id={inputId}
        type="search"
        autoComplete="off"
        enterKeyHint="search"
        value={draft}
        placeholder={placeholder}
        onChange={(event) => setDraft(event.target.value)}
        className={cn(
          'h-11 w-full rounded-lg bg-surface-card pr-3 pl-10 text-body-md font-medium text-foreground placeholder:text-text-secondary focus-visible:outline-2 focus-visible:outline-ring [&::-webkit-search-cancel-button]:hidden',
          className,
        )}
        {...inputProps}
      />
    </form>
  )
}
