import { useEffect, useRef, useState } from "react";
import {
  deleteRating,
  getMovieDetails,
  getRatings,
  saveRating,
  searchMovies,
} from "./services/api";
import type {
  MovieDetails,
  MovieSearchResult,
  Page,
  Rating,
} from "./data/types";
import { EmptyResultsSection } from "./components/EmptyResultsSection";
import { Header } from "./components/Header";
import { MovieDetailsModal } from "./components/MovieDetailsModal";
import { RatedMovies } from "./components/RatedMovies";
import { SearchSection } from "./components/SearchSection";

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Ocorreu um erro inesperado. Tente novamente.";
}

export default function App() {
  const [activePage, setActivePage] = useState<Page>("buscar");
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [ratingsLoading, setRatingsLoading] = useState(true);
  const [ratingsError, setRatingsError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [searchResults, setSearchResults] = useState<MovieSearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const searchController = useRef<AbortController | null>(null);

  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null);
  const [selectedRating, setSelectedRating] = useState<Rating | null>(null);
  const [modalMode, setModalMode] = useState<"details" | "rate" | null>(null);
  const [initialScore, setInitialScore] = useState(0);
  const [savingRating, setSavingRating] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Backend: carrega as avaliações salvas quando o aplicativo é iniciado.
  useEffect(() => {
    let isMounted = true;

    getRatings()
      .then((loadedRatings) => {
        if (isMounted) setRatings(loadedRatings);
      })
      .catch((error: unknown) => {
        if (isMounted) setRatingsError(getErrorMessage(error));
      })
      .finally(() => {
        if (isMounted) setRatingsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedMovie) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (
        event.key === "Escape" &&
        !savingRating &&
        deletingId !== selectedRating?.tmdb_id
      ) {
        closeModal();
      }
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [selectedMovie, savingRating, deletingId, selectedRating]);

  function closeModal() {
    setSelectedMovie(null);
    setSelectedRating(null);
    setModalMode(null);
    setModalError(null);
  }

  async function handleSearch(query: string) {
    searchController.current?.abort();

    if (!query) {
      searchController.current = null;
      setSearchResults([]);
      setSearchLoading(false);
      setHasSearched(false);
      setSearchError("Digite o título ou gênero que deseja buscar.");
      return;
    }

    const controller = new AbortController();
    searchController.current = controller;
    setSearchLoading(true);
    setHasSearched(true);
    setSearchError(null);
    try {
      const results = await searchMovies(query, controller.signal);
      if (searchController.current === controller) setSearchResults(results);
    } catch (error) {
      if (controller.signal.aborted) return;
      setSearchResults([]);
      setSearchError(getErrorMessage(error));
    } finally {
      if (searchController.current === controller) {
        searchController.current = null;
        setSearchLoading(false);
      }
    }
  }

  function handleClearSearch() {
    searchController.current?.abort();
    searchController.current = null;
    setSearchResults([]);
    setSearchLoading(false);
    setHasSearched(false);
    setSearchError(null);
  }

  async function handleSelectSearchResult(movie: MovieSearchResult) {
    const existingRating = ratings.find(
      (rating) => rating.tmdb_id === movie.id,
    );
    setDetailsLoading(true);
    setSearchError(null);
    setModalError(null);
    try {
      const details = await getMovieDetails(movie.id);
      setSelectedMovie(details);
      setSelectedRating(existingRating ?? null);
      setInitialScore(existingRating?.score ?? 0);
      // Filme sem nota abre para a primeira avaliação; filme já avaliado abre em modo de consulta.
      setModalMode(existingRating ? "details" : "rate");
    } catch (error) {
      setSearchError(getErrorMessage(error));
    } finally {
      setDetailsLoading(false);
    }
  }

  async function handleOpenDetails(rating: Rating) {
    setModalError(null);
    setRatingsError(null);
    setDetailsLoading(true);
    try {
      const details = await getMovieDetails(rating.tmdb_id);
      setSelectedMovie(details);
      setSelectedRating(rating);
      setInitialScore(rating.score);
      setModalMode("details");
    } catch (error) {
      setRatingsError(getErrorMessage(error));
    } finally {
      setDetailsLoading(false);
    }
  }

  function handleEditRating() {
    setModalError(null);
    // Mantém o mesmo modal aberto e troca da consulta para a escolha de uma nova nota.
    setModalMode("rate");
  }

  function handleCancelEdit() {
    setModalError(null);
    setInitialScore(selectedRating?.score ?? 0);
    setModalMode("details");
  }

  async function handleSaveRating(score: number) {
    if (!selectedMovie) return;

    setSavingRating(true);
    setModalError(null);
    try {
      const savedRating = await saveRating(selectedMovie, score);
      setRatings((current) => [
        savedRating,
        ...current.filter((rating) => rating.tmdb_id !== savedRating.tmdb_id),
      ]);
      closeModal();
    } catch (error) {
      setModalError(getErrorMessage(error));
    } finally {
      setSavingRating(false);
    }
  }

  async function handleDeleteRating(rating: Rating) {
    setDeletingId(rating.tmdb_id);
    setRatingsError(null);
    setModalError(null);
    try {
      await deleteRating(rating.tmdb_id);
      setRatings((current) =>
        current.filter((item) => item.tmdb_id !== rating.tmdb_id),
      );
      closeModal();
    } catch (error) {
      setModalError(getErrorMessage(error));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-page font-sans text-cream antialiased">
      <Header activePage={activePage} onNavigate={setActivePage} />

      <main id="inicio">
        {activePage === "buscar" ? (
          <>
            <SearchSection
              results={searchResults}
              ratings={ratings}
              loading={searchLoading}
              detailsLoading={detailsLoading}
              hasSearched={hasSearched}
              error={searchError}
              onSearch={handleSearch}
              onClearSearch={handleClearSearch}
              onSelectMovie={handleSelectSearchResult}
            />
            {!hasSearched && <EmptyResultsSection />}
          </>
        ) : (
          <>
            {detailsLoading && (
              <p
                className="mx-auto max-w-4xl px-5 pt-8 text-center text-muted"
                aria-live="polite"
              >
                Carregando detalhes do filme...
              </p>
            )}
            <RatedMovies
              ratings={ratings}
              loading={ratingsLoading}
              error={ratingsError}
              onOpenMovie={handleOpenDetails}
            />
          </>
        )}
      </main>

      {selectedMovie && modalMode && (
        <MovieDetailsModal
          movie={selectedMovie}
          score={initialScore}
          rating={selectedRating}
          editing={modalMode === "rate" && selectedRating !== null}
          saving={savingRating}
          deleting={
            selectedRating !== null && deletingId === selectedRating.tmdb_id
          }
          error={modalError}
          onClose={closeModal}
          onEdit={handleEditRating}
          onCancelEdit={handleCancelEdit}
          onScoreChange={setInitialScore}
          onSave={() => handleSaveRating(initialScore)}
          onDelete={() => {
            if (selectedRating) void handleDeleteRating(selectedRating);
          }}
        />
      )}
    </div>
  );
}
