import { FiFilm } from 'react-icons/fi'
import type { Rating } from '../data/types'
import { RatedMovieCard } from './RatedMovieCard'

type EmptyResultsSectionProps = {
  ratings: Rating[]
  loading: boolean
  error: string | null
  deletingId: number | null
  onOpenMovie: (rating: Rating) => void
  onEditMovie: (rating: Rating) => void
  onDeleteMovie: (rating: Rating) => void
}

// Backend ratings replace this frontend empty state after the first saved film.
export function EmptyResultsSection({
  ratings,
  loading,
  error,
  deletingId,
  onOpenMovie,
  onEditMovie,
  onDeleteMovie,
}: EmptyResultsSectionProps) {
  if (loading && ratings.length === 0) {
    return (
      <section
        id="resultados"
        className="px-5 py-16 text-center text-muted sm:px-6"
        aria-live="polite"
      >
        Carregando seus filmes...
      </section>
    )
  }

  if (ratings.length > 0) {
    return (
      <section
        id="resultados"
        className="mx-auto max-w-[1478px] px-5 pt-12 pb-16 sm:px-6 sm:pt-[66px]"
        aria-labelledby="recent-ratings-title"
      >
        <div className="mb-8 flex items-end justify-between gap-4 border-b border-line pb-5">
          <h2
            id="recent-ratings-title"
            className="font-serif text-3xl font-extrabold text-cream sm:text-4xl"
          >
            Seus filmes
          </h2>
          <span className="shrink-0 rounded-full border border-line bg-surface px-4 py-2 text-sm font-bold text-muted">
            {ratings.length} {ratings.length === 1 ? 'filme' : 'filmes'}
          </span>
        </div>
        {error && (
          <p className="mb-5 text-sm text-danger" role="alert">
            {error}
          </p>
        )}
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">
          {ratings.map((rating) => (
            <RatedMovieCard
              key={rating.tmdb_id}
              rating={rating}
              onOpen={onOpenMovie}
              onEdit={onEditMovie}
              onDelete={onDeleteMovie}
              deleting={deletingId === rating.tmdb_id}
            />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section
      id="resultados"
      className="flex min-h-[calc(100vh-72px)] flex-col items-center px-5 pt-12 pb-16 text-center sm:min-h-[calc(100vh-87px)] sm:px-6 sm:pt-[66px]"
      aria-labelledby="empty-state-title"
    >
      {error && (
        <p className="mb-6 text-sm text-danger" role="alert">
          {error}
        </p>
      )}
      <div
        className="flex h-[100px] w-[150px] items-center justify-center gap-[25px] border-y border-line/50"
        aria-hidden="true"
      >
        <span className="size-[15px] rounded-full bg-star shadow-[0_0_18px_var(--color-star)]" />
        <FiFilm className="size-[15px] text-accent drop-shadow-[0_0_8px_var(--color-accent)]" />
        <span className="size-[15px] rounded-full bg-star shadow-[0_0_18px_var(--color-star)]" />
      </div>
      <h2
        id="empty-state-title"
        className="mt-[40px] max-w-[540px] font-serif text-[32px] leading-[1.2] font-extrabold tracking-[-0.8px] text-cream sm:text-[38px]"
      >
        Seu próximo filme está aqui.
      </h2>
      <p className="mt-[18px] text-base leading-[1.5] text-muted sm:text-lg">
        Busque por um título ou gênero para começar.
      </p>
    </section>
  )
}
