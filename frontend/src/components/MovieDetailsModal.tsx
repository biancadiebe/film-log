//modal de detalhes do filme - infos do filme
import { FiX } from 'react-icons/fi'
import { posterUrl } from '../data/api'
import { MoviePoster, RatingStars } from './MoviePoster'
import type { MovieDetails } from '../data/types'

type MovieDetailsModalProps = {
  movie: MovieDetails
  score: number
  onClose: () => void
}

// Frontend detail view for movie metadata fetched from the backend.
export function MovieDetailsModal({
  movie,
  score,
  onClose,
}: MovieDetailsModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-page/80 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <section
        className="relative max-h-[calc(100vh-24px)] w-full max-w-[1235px] overflow-y-auto rounded-xl border border-line bg-surface shadow-2xl sm:max-h-[calc(100vh-64px)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="movie-details-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 z-10 flex size-11 cursor-pointer items-center justify-center rounded-full border border-line bg-page/70 text-muted transition-colors hover:text-cream focus-visible:outline-2 focus-visible:outline-cream sm:top-5 sm:right-5"
          type="button"
          aria-label="Fechar detalhes"
          onClick={onClose}
        >
          <FiX className="size-5" aria-hidden="true" />
        </button>

        <div className="grid gap-7 p-5 sm:gap-10 sm:p-8 lg:grid-cols-[minmax(260px,382px)_1fr] lg:gap-12 lg:p-12">
          <MoviePoster
            movie={movie}
            className="mx-auto aspect-[2/3] w-full max-w-[382px] self-start"
          />

          <div className="min-w-0">
            <p className="text-[11px] font-extrabold tracking-[1.8px] text-muted uppercase sm:text-[13px]">
              Detalhes do filme
            </p>
            <h2
              id="movie-details-title"
              className="mt-3 font-serif text-4xl leading-tight font-extrabold tracking-[-1.5px] text-cream sm:text-[56px]"
            >
              {movie.title}
            </h2>
            <p className="mt-1 text-base text-muted">{movie.release_date}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <span
                  key={genre}
                  className="rounded-full border border-line px-4 py-1.5 text-sm font-semibold text-muted"
                >
                  {genre}
                </span>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="text-[11px] font-extrabold tracking-[1.8px] text-muted uppercase sm:text-[13px]">
                Sinopse
              </h3>
              <p className="mt-4 text-base leading-8 text-cream/90 sm:text-lg">
                {movie.overview || 'Sinopse indisponível.'}
              </p>
            </div>

            <div className="mt-8">
              <h3 className="text-[11px] font-extrabold tracking-[1.8px] text-muted uppercase sm:text-[13px]">
                Elenco
              </h3>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-5">
                {movie.cast.map((person) => (
                  <div
                    className="flex w-[88px] flex-col items-center text-center"
                    key={person.name}
                  >
                    <div
                      className="size-16 overflow-hidden rounded-full border border-line bg-surface"
                      role="img"
                      aria-label={`Retrato ilustrativo de ${person.name}`}
                    >
                      {person.profile_path && (
                        <img
                          className="size-full object-cover"
                          src={posterUrl(person.profile_path, 'w185') ?? ''}
                          alt=""
                          loading="lazy"
                        />
                      )}
                    </div>
                    <span className="mt-2 text-sm font-bold text-cream">
                      {person.name}
                    </span>
                    <span className="mt-0.5 text-xs text-muted">
                      {person.character}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 border-t border-line pt-6">
              <h3 className="text-[11px] font-extrabold tracking-[1.8px] text-muted uppercase sm:text-[13px]">
                Sua avaliação
              </h3>
              <div className="mt-3 flex items-center gap-3">
                <RatingStars score={score} />
                <span className="text-sm font-bold text-star">
                  {score}/5
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
