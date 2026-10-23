import { cn } from '@/shared/lib'
import { ChevronDown, Eye, EyeOff } from 'lucide-react'
import { useState, type ComponentProps, type ReactNode } from 'react'

const controlClass =
  'h-10 w-full min-w-0 rounded-[2px] border border-border bg-ink px-3 text-body text-foreground transition-colors placeholder:text-tan focus-visible:border-brand focus-visible:outline-none aria-invalid:border-coral disabled:cursor-not-allowed disabled:opacity-60'

interface FieldProps {
  id: string
  label: ReactNode
  required?: boolean
  error?: string
  hint?: ReactNode
  hideLabel?: boolean
  className?: string
  children: ReactNode
}

function fieldDescribedBy(id: string, error?: string, hint?: ReactNode) {
  return [error ? `${id}-error` : null, hint ? `${id}-hint` : null].filter(Boolean).join(' ') || undefined
}

function Field({ id, label, required, error, hint, hideLabel, className, children }: FieldProps) {
  return (
    <div data-slot="field" className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={id} className={cn('text-body text-foreground', hideLabel && 'sr-only')}>
        {label}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-coral">
            *
          </span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-caption text-text-secondary">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-caption text-coral">
          {error}
        </p>
      )}
    </div>
  )
}

function TextInput({ className, ...props }: ComponentProps<'input'>) {
  return <input data-slot="text-input" className={cn(controlClass, className)} {...props} />
}

function TextArea({ className, ...props }: ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="text-area"
      className={cn(controlClass, 'h-auto min-h-[150px] resize-y py-2', className)}
      {...props}
    />
  )
}

function PasswordInput({ className, ...props }: Omit<ComponentProps<'input'>, 'type'>) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <TextInput type={visible ? 'text' : 'password'} className={cn('pr-11', className)} {...props} />
      <button
        type="button"
        onClick={() => setVisible((value) => !value)}
        aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
        aria-pressed={visible}
        className="absolute inset-y-0 right-0 grid w-11 place-items-center text-text-secondary hover:text-text-accent"
      >
        {visible ? <Eye className="size-5" aria-hidden="true" /> : <EyeOff className="size-5" aria-hidden="true" />}
      </button>
    </div>
  )
}

function SelectInput({ className, children, ...props }: ComponentProps<'select'>) {
  return (
    <div className="relative">
      <select data-slot="select-input" className={cn(controlClass, 'appearance-none pr-10', className)} {...props}>
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-text-secondary"
      />
    </div>
  )
}

export { Field, fieldDescribedBy, PasswordInput, SelectInput, TextArea, TextInput }
