import { useId, useState, type ReactNode } from 'react'
import {
  get,
  type FieldError,
  type FieldErrors,
  type FieldValues,
  type Path,
  type Resolver,
  type UseFormReturn,
  type UseFormSetError,
} from 'react-hook-form'

interface StandardIssue {
  message: string
  path?: ReadonlyArray<PropertyKey | { key: PropertyKey }>
}

interface StandardSchema<Output> {
  '~standard': {
    validate: (
      value: unknown,
    ) => { value: Output; issues?: undefined } | { issues: ReadonlyArray<StandardIssue> } | Promise<unknown>
  }
}

type ValidationResult<Output> = { value: Output; issues?: undefined } | { issues: ReadonlyArray<StandardIssue> }

function issuePath(issue: StandardIssue) {
  return (issue.path ?? []).map((segment) => String(typeof segment === 'object' ? segment.key : segment))
}

export function standardResolver<T extends FieldValues>(schema: StandardSchema<T>): Resolver<T> {
  return async (values) => {
    const result = (await schema['~standard'].validate(values)) as ValidationResult<T>
    if (!result.issues) return { values: result.value, errors: {} }

    const errors: Record<string, unknown> = {}
    for (const issue of result.issues) {
      const path = issuePath(issue)
      if (!path.length) continue
      let node = errors
      path.slice(0, -1).forEach((segment) => {
        node[segment] ??= {}
        node = node[segment] as Record<string, unknown>
      })
      const leaf = path[path.length - 1]
      node[leaf] ??= { type: 'validation', message: issue.message }
    }
    return { values: {}, errors: errors as FieldErrors<T> }
  }
}

function applyFieldErrors<T extends FieldValues>(
  setError: UseFormSetError<T>,
  fields: Record<string, string> | undefined,
  allowed: ReadonlyArray<Path<T>>,
) {
  if (!fields) return false
  let applied = false
  for (const [name, message] of Object.entries(fields)) {
    if (!allowed.includes(name as Path<T>)) continue
    setError(name as Path<T>, { type: 'server', message }, { shouldFocus: !applied })
    applied = true
  }
  return applied
}

function fieldDescribedBy(id: string, error?: string, hint?: ReactNode) {
  return [error ? `${id}-error` : null, hint ? `${id}-hint` : null].filter(Boolean).join(' ') || undefined
}

export function useFormFields<T extends FieldValues>({ register, formState }: UseFormReturn<T>) {
  const prefix = useId()
  const { errors } = formState

  return (name: Path<T>) => {
    const id = `${prefix}-${name}`
    const error = (get(errors, name) as FieldError | undefined)?.message
    return {
      field: { id, error },
      control: {
        id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': fieldDescribedBy(id, error),
        ...register(name),
      },
    }
  }
}

interface ServerErrorPayload {
  message: string
  fields?: Record<string, string>
}

export function useServerErrors<T extends FieldValues>(setError: UseFormSetError<T>, allowed: ReadonlyArray<Path<T>>) {
  const [formError, setFormError] = useState<string>()

  return {
    formError,
    clear: () => setFormError(undefined),
    report: ({ message, fields }: ServerErrorPayload) => {
      if (!applyFieldErrors(setError, fields, allowed)) setFormError(message)
    },
  }
}
