import type { FieldErrors, FieldValues, Path, Resolver, UseFormSetError } from 'react-hook-form'

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

export function applyFieldErrors<T extends FieldValues>(
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
