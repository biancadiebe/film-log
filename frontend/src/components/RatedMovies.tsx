import { useEffect, useState } from 'react'
import type { Rating } from '../data/types'
import { MovieCard } from './MovieCard'

// Quantidade de filmes exibidos por página na seção de avaliados
const RATINGS_PER_PAGE = 8

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
  // Guarda qual página da lista de filmes avaliados está aberta
  const [currentPageState, setCurrentPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(ratings.length / RATINGS_PER_PAGE))
  const currentPage = Math.min(currentPageState, totalPages)
  // Separa os filmes que aparecem na página atual
  const firstRatingIndex = (currentPage - 1) * RATINGS_PER_PAGE
  const visibleRatings = ratings.slice(
    firstRatingIndex,
    firstRatingIndex + RATINGS_PER_PAGE,
  )

  useEffect(() => {
    // Volta para uma página válida se a lista diminuir depois de excluir uma avaliação
    if (currentPageState !== currentPage) setCurrentPage(currentPage)
  }, [currentPage, currentPageState])

  //Adicionando os números das páginas, sem ocupar espaço com todos eles
  function getPaginationItems(): (number | 'ellipsis')[] {
    const pages = [
      ...new Set(
        [1, currentPage - 1, currentPage, currentPage + 1, totalPages].filter(
          (page) => page >= 1 && page <= totalPages,
        ),
      ),
    ].sort((a, b) => a - b)

    return pages.flatMap((page, index) => {
      if (index === 0) return [page]

      const previousPage = pages[index - 1]
      const gap = page - previousPage

      if (gap === 2) return [previousPage + 1, page]
      if (gap > 2) return ['ellipsis', page]

      return [page]
    })
  }

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
        <>
          <p className="sr-only" aria-live="polite">
            Página {currentPage} de {totalPages}. Exibindo avaliações{' '}
            {firstRatingIndex + 1} a {firstRatingIndex + visibleRatings.length} de{' '}
            {ratings.length}.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">
            {visibleRatings.map((rating) => (
              <MovieCard
                key={rating.tmdb_id}
                movie={rating}
                score={rating.score}
                label={`Ver detalhes de ${rating.title}`}
                onClick={() => onOpenMovie(rating)}
              />
            ))}
          </div>
          {/* Adicionando os controles para trocar de página */}
          {totalPages > 1 && (
            <nav
              className="mt-8 flex flex-wrap items-center justify-center gap-2"
              aria-label="Paginação dos filmes avaliados"
            >
              <button
                type="button"
                className="rounded-md border border-line px-3 py-2 text-sm text-cream disabled:cursor-not-allowed disabled:opacity-40"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Anterior
              </button>

              {getPaginationItems().map((item, index) =>
                item === 'ellipsis' ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-1 text-muted"
                    aria-hidden="true"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={item}
                    type="button"
                    className={`min-w-10 rounded-md border px-3 py-2 text-sm ${
                      item === currentPage
                        ? 'border-accent bg-accent text-white'
                        : 'border-line text-cream hover:bg-surface'
                    }`}
                    aria-label={`Página ${item}`}
                    aria-current={item === currentPage ? 'page' : undefined}
                    onClick={() => setCurrentPage(item)}
                  >
                    {item}
                  </button>
                ),
              )}

              <button
                type="button"
                className="rounded-md border border-line px-3 py-2 text-sm text-cream disabled:cursor-not-allowed disabled:opacity-40"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Próxima
              </button>
            </nav>
          )}
        </>
      )}
    </section>
  )
}
