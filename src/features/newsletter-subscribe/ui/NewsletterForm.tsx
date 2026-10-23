import { useId } from 'react'
import { useNewsletterForm } from '../model'

export function NewsletterForm() {
  const id = useId()
  const errorId = `${id}-error`
  const { email, setEmail, error, onSubmit, isPending } = useNewsletterForm()

  return (
    <form noValidate className="w-full" onSubmit={onSubmit}>
      <label htmlFor={id} className="sr-only">
        E-mail para receber lançamentos
      </label>
      <div className="flex h-10 overflow-hidden rounded-md">
        <input
          id={id}
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="digite seu e-mail..."
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="min-w-0 flex-1 bg-surface-dark px-3 text-body text-foreground placeholder:text-tan focus-visible:outline-2 focus-visible:-outline-offset-2"
        />
        <button
          type="submit"
          disabled={isPending}
          className="bg-brand px-3 text-body-lg font-bold text-ink transition-colors hover:bg-brand-light disabled:opacity-70"
        >
          {isPending ? 'Enviando…' : 'Enviar'}
        </button>
      </div>
      {error && (
        <p id={errorId} role="alert" className="mt-2 text-caption text-coral">
          {error}
        </p>
      )}
    </form>
  )
}
