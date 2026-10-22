import { FiFilm } from 'react-icons/fi'
import type { Rating } from '../data/types'
import { MovieCard } from './MovieCard'

type EmptyResultsSectionProps = {
  ratings: Rating[]
  loading: boolean
  error: string | null
  onOpenMovie: (rating: Rating) => void
}

//Espaço vazio quando não existe nenhum filme cadastrado, ou quando a busca não retorna nenhum filme
export function EmptyResultsSection({
  ratings,
  loading,
  error,
  onOpenMovie,
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
        className="mx-auto max-w-369.5 px-5 pt-12 pb-16 sm:px-6 sm:pt-16.5"
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
            <MovieCard
              key={rating.tmdb_id}
              movie={rating}
              score={rating.score}
              label={`Ver detalhes de ${rating.title}`}
              onClick={() => onOpenMovie(rating)}
            />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section
      id="resultados"
      className="flex min-h-[calc(100vh-72px)] flex-col items-center px-5 pt-12 pb-16 text-center sm:min-h-[calc(100vh-87px)] sm:px-6 sm:pt-16.5"
      aria-labelledby="empty-state-title"
    >
      {error && (
        <p className="mb-6 text-sm text-danger" role="alert">
          {error}
        </p>
      )}
      <div
        className="flex h-25 w-37.5 items-center justify-center gap-6.25 border-y border-line/50"
        aria-hidden="true"
      >
        <span className="size-3.75 rounded-full bg-star shadow-[0_0_18px_var(--color-star)]" />
        <FiFilm className="size-3.75 text-accent drop-shadow-[0_0_8px_var(--color-accent)]" />
        <span className="size-3.75 rounded-full bg-star shadow-[0_0_18px_var(--color-star)]" />
      </div>
      <h2
        id="empty-state-title"
        className="mt-10 max-w-135 font-serif text-[32px] leading-[1.2] font-extrabold tracking-[-0.8px] text-cream sm:text-[38px]"
      >
        Seu próximo filme está aqui.
      </h2>
      <p className="mt-4.5 text-base leading-normal text-muted sm:text-lg">
        Busque por um título ou gênero para começar.
      </p>
    </section>
  )
}
