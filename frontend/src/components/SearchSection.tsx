import { useState, type FormEvent } from 'react'
import { Button } from './Button'
import { posterUrl } from '../data/api'
import type { MovieSearchResult } from '../data/types'

type SearchSectionProps = {
  results: MovieSearchResult[]
  loading: boolean
  detailsLoading: boolean
  hasSearched: boolean
  error: string | null
  onSearch: (query: string) => void
  onSelectMovie: (movie: MovieSearchResult) => void
}

// Frontend search form; results and search requests are provided by the backend.
export function SearchSection({
  results,
  loading,
  detailsLoading,
  hasSearched,
  error,
  onSearch,
  onSelectMovie,
}: SearchSectionProps) {
  const [query, setQuery] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSearch(query.trim())
  }

  return (
    <section
      id="buscar"
      className="min-h-[calc(100vh-72px)] px-5 pt-[92px] pb-14 sm:min-h-[calc(100vh-87px)] sm:px-6 sm:pt-[116px] sm:pb-20"
      aria-labelledby="hero-title"
    >
      <div className="mx-auto w-full max-w-[816px] text-center">
        <p className="mb-4 text-[11px] leading-[1.5] font-extrabold tracking-[1.8px] text-muted uppercase sm:mb-[19px] sm:text-[13px]">
          BEM-VINDO AO FILM-LOG
        </p>
        <h1
          id="hero-title"
          className="mx-auto max-w-[900px] font-serif text-[clamp(40px,11vw,58px)] leading-[1.04] font-extrabold tracking-[-1.8px] text-cream sm:text-[clamp(46px,4.15vw,72px)] sm:tracking-[-2.8px]"
        >
          Chegou a hora de avaliar.
        </h1>
        <p className="mx-auto mt-5 mb-8 max-w-[620px] text-[17px] leading-[1.5] text-muted sm:mt-[22px] sm:mb-11 sm:text-xl">
          Registre as histórias que ficaram com você.
        </p>

        <form
          className="flex min-h-[66px] items-center gap-[9px] rounded-[10px] border border-line bg-surface p-2 text-left focus-within:border-accent focus-within:ring-[3px] focus-within:ring-accent/15 sm:min-h-[78px] sm:gap-[14px] sm:p-[10px]"
          role="search"
          onSubmit={handleSubmit}
        >
          <label className="sr-only" htmlFor="movie-search">
            Busque por um filme
          </label>
          <svg
            className="ml-2 size-5 shrink-0 text-muted sm:ml-[14px] sm:size-[23px]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="10.8" cy="10.8" r="7.3" />
            <path d="m16.2 16.2 4.1 4.1" />
          </svg>
          <input
            id="movie-search"
            name="query"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Busque por um filme..."
            className="h-12 w-full min-w-0 border-0 bg-transparent p-0 text-base text-cream outline-none placeholder:text-muted/70 sm:h-[54px] sm:text-[21px]"
          />
          <Button type="submit">
            {loading ? 'Buscando...' : 'Buscar'}
          </Button>
        </form>

        {error && (
          <p className="mt-4 text-left text-sm text-danger" role="alert">
            {error}
          </p>
        )}

        {detailsLoading && (
          <p className="mt-5 text-left text-muted" aria-live="polite">
            Carregando detalhes do filme...
          </p>
        )}

        {results.length > 0 && (
          <div className="mt-8 text-left" aria-live="polite">
            <h2 className="mb-4 font-serif text-2xl font-extrabold text-cream">
              Resultados da busca
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {results.map((movie) => {
                const poster = posterUrl(movie.poster_path, 'w342')
                const year = movie.release_date.slice(0, 4)

                return (
                  <button
                    key={movie.id}
                    className="group min-w-0 cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4"
                    type="button"
                    onClick={() => onSelectMovie(movie)}
                  >
                    <span className="relative block aspect-[2/3] overflow-hidden rounded-lg border border-line bg-surface transition-colors group-hover:border-accent">
                      {poster ? (
                        <img
                          className="size-full object-cover"
                          src={poster}
                          alt=""
                          loading="lazy"
                        />
                      ) : (
                        <span className="flex size-full items-center justify-center text-sm text-muted">
                          Pôster indisponível
                        </span>
                      )}
                    </span>
                    <span className="mt-2 block truncate font-bold text-cream">
                      {movie.title}
                    </span>
                    {year && (
                      <span className="mt-0.5 block text-sm text-muted">
                        {year}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}
        {hasSearched && !loading && !error && results.length === 0 && (
          <p className="mt-5 text-left text-muted" aria-live="polite">
            Nenhum filme encontrado. Tente buscar por outro título.
          </p>
        )}
      </div>
    </section>
  )
}
