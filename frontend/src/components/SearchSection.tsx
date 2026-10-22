import { useState, type FormEvent } from 'react'
import { FiX } from 'react-icons/fi'
import { Button } from './Button'
import { MovieCard } from './MovieCard'
import type { MovieSearchResult, Rating } from '../data/types'

type SearchSectionProps = {
  results: MovieSearchResult[]
  ratings: Rating[]
  loading: boolean
  detailsLoading: boolean
  hasSearched: boolean
  error: string | null
  onSearch: (query: string) => void
  onClearSearch: () => void
  onSelectMovie: (movie: MovieSearchResult) => void
}

//Seção inicial do front, com o texto de boas vindas e o formulário de pesquisa
export function SearchSection({
  results,
  ratings,
  loading,
  detailsLoading,
  hasSearched,
  error,
  onSearch,
  onClearSearch,
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
      className="min-h-[calc(100vh-72px)] px-5 pt-23 pb-14 sm:min-h-[calc(100vh-87px)] sm:px-6 sm:pt-29 sm:pb-20"
      aria-labelledby="hero-title"
    >
      <div className="mx-auto w-full max-w-204 text-center">
        <p className="mb-4 text-[11px] leading-normal font-extrabold tracking-[1.8px] text-muted uppercase sm:mb-4.75 sm:text-[13px]">
          BEM-VINDO AO FILM-LOG
        </p>
        <h1
          id="hero-title"
          className="mx-auto max-w-225 font-serif text-[clamp(40px,11vw,58px)] leading-[1.04] font-extrabold tracking-[-1.8px] text-cream sm:text-[clamp(46px,4.15vw,72px)] sm:tracking-[-2.8px]"
        >
          Chegou a hora de avaliar.
        </h1>
        <p className="mx-auto mt-5 mb-8 max-w-155 text-[17px] leading-normal text-muted sm:mt-5.5 sm:mb-11 sm:text-xl">
          Registre as histórias que ficaram com você.
        </p>

        <form
          className="flex min-h-16.5 items-center gap-2.25 rounded-[10px] border border-line bg-surface p-2 text-left focus-within:border-accent focus-within:ring-[3px] focus-within:ring-accent/15 sm:min-h-19.5 sm:gap-3.5 sm:p-2.5"
          role="search"
          onSubmit={handleSubmit}
        >
          <label className="sr-only" htmlFor="movie-search">
            Busque por um filme
          </label>
          <svg
            className="ml-2 size-5 shrink-0 text-muted sm:ml-3.5 sm:size-5.75"
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
            className="h-12 w-full min-w-0 border-0 bg-transparent p-0 text-base text-cream outline-none placeholder:text-muted/70 sm:h-13.5 sm:text-[21px]"
          />
          {query && (
            <button
              className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:bg-page hover:text-cream focus-visible:outline-2 focus-visible:outline-accent"
              type="button"
              aria-label="Limpar busca"
              onClick={() => {
                setQuery('')
                onClearSearch()
              }}
            >
              <FiX className="size-4" aria-hidden="true" />
            </button>
          )}
          <Button className="shrink-0" type="submit">
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
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">
              {results.map((movie) => {
                const rating = ratings.find(
                  (item) => item.tmdb_id === movie.id,
                )

                return (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    score={rating?.score}
                    label={`${rating ? 'Ver detalhes de' : 'Avaliar'} ${movie.title}`}
                    onClick={() => onSelectMovie(movie)}
                  />
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
