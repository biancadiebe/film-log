import type { Rating } from '../data/types'
import { MovieCard } from './MovieCard'

type RatedMoviesProps = {
  ratings: Rating[]
  loading: boolean
  error: string | null
  onOpenMovie: (rating: Rating) => void
}

//Configura a área do "Avaliados", textos principais e organização dos cards
export function RatedMovies({
  ratings,
  loading,
  error,
  onOpenMovie,
}: RatedMoviesProps) {
  return (
    <section
      id="avaliados"
      className="mx-auto min-h-[calc(100vh-87px)] max-w-369.5 px-5 pt-12 pb-16 sm:px-6 sm:pt-16.5"
      aria-labelledby="rated-title"
    >
      <div className="flex items-end justify-between gap-4 border-b border-line pb-5">
        <div>
          <p className="mb-3 text-[11px] font-extrabold tracking-[1.8px] text-muted uppercase sm:text-[13px]">
            Seu diário de cinema
          </p>
          <h1
            id="rated-title"
            className="font-serif text-4xl leading-tight font-extrabold tracking-[-1.5px] text-cream sm:text-[56px]"
          >
            Seus filmes avaliados
          </h1>
        </div>
        <span className="mb-1 shrink-0 rounded-full border border-line bg-surface px-4 py-2 text-sm font-bold text-muted">
          {ratings.length} {ratings.length === 1 ? 'filme' : 'filmes'}
        </span>
      </div>

      {error && (
        <p className="mt-5 text-sm text-danger" role="alert">
          {error}
        </p>
      )}
      {loading && ratings.length === 0 ? (
        <p className="mt-8 text-muted" aria-live="polite">
          Carregando avaliações...
        </p>
      ) : ratings.length === 0 ? (
        <p className="mt-8 text-muted">
          Você ainda não avaliou nenhum filme.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">
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
      )}
    </section>
  )
}
