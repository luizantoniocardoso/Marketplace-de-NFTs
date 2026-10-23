import { JOURNAL_POSTS } from '../model'
import { JournalCard } from './JournalCard'

export function Journal() {
  return (
    <section aria-labelledby="journal-title" className="page-container mt-20 md:mt-24">
      <h2 id="journal-title" className="text-center text-[24px] leading-8 font-bold md:text-heading">
        Diário da Cunhagem
      </h2>
      <p className="mx-auto mt-2 text-center text-caption text-text-secondary md:text-body">
        Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.
      </p>
      <ul className="-mx-4 mt-8 flex snap-x [scrollbar-width:none] gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 xl:grid-cols-4">
        {JOURNAL_POSTS.map((post) => (
          <li
            key={post.title}
            className="w-[78%] shrink-0 snap-start overflow-hidden rounded-lg bg-surface-card md:w-auto"
          >
            <JournalCard post={post} />
          </li>
        ))}
      </ul>
    </section>
  )
}
