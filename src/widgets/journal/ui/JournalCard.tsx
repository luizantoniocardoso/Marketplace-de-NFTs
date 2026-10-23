import { artworkUrl } from '@/shared/lib'
import { ComingSoon } from '@/shared/ui'
import type { JournalPost } from '../model'

export function JournalCard({ post }: { post: JournalPost }) {
  return (
    <article>
      <img
        src={artworkUrl(post.artwork, 480)}
        width={480}
        height={340}
        loading="lazy"
        decoding="async"
        alt=""
        className="aspect-[268/194] w-full object-cover"
      />
      <div className="px-4 pt-4 pb-5">
        <p className="text-tiny font-medium text-tan">
          <time>{post.date}</time> &nbsp;|&nbsp; Leitura de {post.reading} min
        </p>
        <h3 className="mt-2 text-body-lg leading-[22px] font-bold">{post.title}</h3>
        <p className="mt-2 text-caption leading-[17px] text-text-secondary">{post.text}</p>
        <ComingSoon className="mt-2 inline-block text-caption font-bold text-text-accent">Ler mais →</ComingSoon>
      </div>
    </article>
  )
}
