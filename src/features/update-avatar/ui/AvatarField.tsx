import { useId, useRef, useState } from 'react'
import { UserAvatar } from '@/entities/user'
import type { UserDto } from '@/shared/contracts'
import { Button } from '@/shared/ui'
import { AVATAR_ACCEPT, useRemoveAvatar, useUploadAvatar, validateAvatar } from '../model'

export function AvatarField({ user }: { user: UserDto }) {
  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string>()
  const upload = useUploadAvatar()
  const remove = useRemoveAvatar()
  const busy = upload.isPending || remove.isPending

  return (
    <div role="group" aria-labelledby={`${id}-label`} className="flex flex-col gap-2">
      <p id={`${id}-label`} className="text-body text-foreground">
        Avatar
      </p>
      <div className="flex items-center gap-6">
        <UserAvatar user={user} />
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={AVATAR_ACCEPT}
          className="sr-only"
          tabIndex={-1}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(event) => {
            const file = event.target.files?.[0]
            event.target.value = ''
            if (!file) return
            const message = validateAvatar(file)
            setError(message ?? undefined)
            if (!message) upload.mutate(file)
          }}
        />
        <Button
          type="button"
          variant="brand"
          size="md"
          className="w-[98px]"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          {upload.isPending ? 'Enviando…' : 'Alterar'}
        </Button>
        <button
          type="button"
          disabled={busy || !user.avatarUrl}
          onClick={() => remove.mutate()}
          className="text-body text-foreground hover:text-text-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          Remover
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="text-caption text-coral">
          {error}
        </p>
      )}
    </div>
  )
}
