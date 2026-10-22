import { useEffect, useState } from 'react'
import {
  deleteRating,
  getMovieDetails,
  getRatings,
  saveRating,
  searchMovies,
} from './data/api'
import type {
  MovieDetails,
  MovieSearchResult,
  Page,
  Rating,
} from './data/types'
import { EmptyResultsSection } from './components/EmptyResultsSection'
import { Header } from './components/Header'
import { MovieDetailsModal } from './components/MovieDetailsModal'
import { RateMovieModal } from './components/RateMovieModal'
import { RatedMovies } from './components/RatedMovies'
import { SearchSection } from './components/SearchSection'

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : 'Ocorreu um erro inesperado. Tente novamente.'
}

export default function App() {
  const [activePage, setActivePage] = useState<Page>('buscar')
  const [ratings, setRatings] = useState<Rating[]>([])
  const [ratingsLoading, setRatingsLoading] = useState(true)
  const [ratingsError, setRatingsError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const [searchResults, setSearchResults] = useState<MovieSearchResult[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [detailsLoading, setDetailsLoading] = useState(false)

  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null)
  const [selectedRating, setSelectedRating] = useState<Rating | null>(null)
  const [modalMode, setModalMode] = useState<'details' | 'rate' | null>(null)
  const [initialScore, setInitialScore] = useState(0)
  const [savingRating, setSavingRating] = useState(false)
  const [modalError, setModalError] = useState<string | null>(null)

  // Backend: carrega as avaliações salvas quando o aplicativo é iniciado.
  useEffect(() => {
    let isMounted = true

    getRatings()
      .then((loadedRatings) => {
        if (isMounted) setRatings(loadedRatings)
      })
      .catch((error: unknown) => {
        if (isMounted) setRatingsError(getErrorMessage(error))
      })
      .finally(() => {
        if (isMounted) setRatingsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!selectedMovie) return

    function closeOnEscape(event: KeyboardEvent) {
      if (
        event.key === 'Escape' &&
        !savingRating &&
        deletingId !== selectedRating?.tmdb_id
      ) {
        closeModal()
      }
    }

    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [selectedMovie, savingRating, deletingId, selectedRating])

  function closeModal() {
    setSelectedMovie(null)
    setSelectedRating(null)
    setModalMode(null)
    setModalError(null)
  }

  async function handleSearch(query: string) {
    if (!query) {
      setSearchResults([])
      setHasSearched(false)
      setSearchError('Digite o título ou gênero que deseja buscar.')
      return
    }

    setSearchLoading(true)
    setHasSearched(true)
    setSearchError(null)
    try {
      setSearchResults(await searchMovies(query))
    } catch (error) {
      setSearchResults([])
      setSearchError(getErrorMessage(error))
    } finally {
      setSearchLoading(false)
    }
  }

  async function openRatingModal(tmdbId: number, score = 0) {
    setDetailsLoading(true)
    setSearchError(null)
    setModalError(null)
    try {
      setSelectedMovie(await getMovieDetails(tmdbId))
      setInitialScore(score)
      setModalMode('rate')
    } catch (error) {
      setSearchError(getErrorMessage(error))
    } finally {
      setDetailsLoading(false)
    }
  }

  async function handleSelectSearchResult(movie: MovieSearchResult) {
    const existingRating = ratings.find((rating) => rating.tmdb_id === movie.id)
    await openRatingModal(movie.id, existingRating?.score ?? 0)
  }

  async function handleOpenDetails(rating: Rating) {
    setModalError(null)
    setRatingsError(null)
    setDetailsLoading(true)
    try {
      const details = await getMovieDetails(rating.tmdb_id)
      setSelectedMovie(details)
      setSelectedRating(rating)
      setInitialScore(rating.score)
      setModalMode('details')
    } catch (error) {
      setRatingsError(getErrorMessage(error))
    } finally {
      setDetailsLoading(false)
    }
  }

  async function handleEditRating(rating: Rating) {
    setDetailsLoading(true)
    setRatingsError(null)
    setModalError(null)
    try {
      setSelectedMovie(await getMovieDetails(rating.tmdb_id))
      setInitialScore(rating.score)
      setModalMode('rate')
    } catch (error) {
      setRatingsError(getErrorMessage(error))
    } finally {
      setDetailsLoading(false)
    }
  }

  async function handleSaveRating(score: number) {
    if (!selectedMovie) return

    setSavingRating(true)
    setModalError(null)
    try {
      const savedRating = await saveRating(selectedMovie, score)
      setRatings((current) => [
        savedRating,
        ...current.filter((rating) => rating.tmdb_id !== savedRating.tmdb_id),
      ])
      closeModal()
    } catch (error) {
      setModalError(getErrorMessage(error))
    } finally {
      setSavingRating(false)
    }
  }

  async function handleDeleteRating(rating: Rating) {
    setDeletingId(rating.tmdb_id)
    setRatingsError(null)
    setModalError(null)
    try {
      await deleteRating(rating.tmdb_id)
      setRatings((current) =>
        current.filter((item) => item.tmdb_id !== rating.tmdb_id),
      )
      closeModal()
    } catch (error) {
      setModalError(getErrorMessage(error))
    } finally {
      setDeletingId(null)
    }
  }

  const sharedRatingsProps = {
    ratings,
    loading: ratingsLoading,
    error: ratingsError,
    onOpenMovie: handleOpenDetails,
  }

  return (
    <div className="min-h-screen bg-page font-sans text-cream antialiased">
      <Header activePage={activePage} onNavigate={setActivePage} />

      <main id="inicio">
        {activePage === 'buscar' ? (
          <>
            <SearchSection
              results={searchResults}
              ratings={ratings}
              loading={searchLoading}
              detailsLoading={detailsLoading}
              hasSearched={hasSearched}
              error={searchError}
              onSearch={handleSearch}
              onSelectMovie={handleSelectSearchResult}
            />
            <EmptyResultsSection {...sharedRatingsProps} />
          </>
        ) : (
          <>
            {detailsLoading && (
              <p className="mx-auto max-w-4xl px-5 pt-8 text-center text-muted" aria-live="polite">
                Carregando detalhes do filme...
              </p>
            )}
            <RatedMovies {...sharedRatingsProps} />
          </>
        )}
      </main>

      {selectedMovie && modalMode === 'rate' && (
        <RateMovieModal
          key={selectedMovie.id}
          movie={selectedMovie}
          initialScore={initialScore}
          saving={savingRating}
          error={modalError}
          onClose={closeModal}
          onSave={handleSaveRating}
        />
      )}
      {selectedMovie && selectedRating && modalMode === 'details' && (
        <MovieDetailsModal
          movie={selectedMovie}
          score={initialScore}
          rating={selectedRating}
          deleting={deletingId === selectedRating.tmdb_id}
          error={modalError}
          onClose={closeModal}
          onEdit={() => handleEditRating(selectedRating)}
          onDelete={() => handleDeleteRating(selectedRating)}
        />
      )}
    </div>
  )
}
