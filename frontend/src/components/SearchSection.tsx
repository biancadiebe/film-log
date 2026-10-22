import { useMemo, useState, type FormEvent } from "react";
import { FiX } from "react-icons/fi";
import { Button } from "./Button";
import { MovieCard } from "./MovieCard";
import { SelectInput } from "./SelectInput";
import type { MovieGenre, MovieSearchResult, Rating } from "../data/types";

type SearchSectionProps = {
  results: MovieSearchResult[];
  ratings: Rating[];
  loading: boolean;
  detailsLoading: boolean;
  hasSearched: boolean;
  error: string | null;
  onSearch: (query: string) => void;
  onClearSearch: () => void;
  onSelectMovie: (movie: MovieSearchResult) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  genres: MovieGenre[];
  genresLoading: boolean;
  genresError: string | null;
};

type MovieSortOrder = "relevance" | "newest" | "oldest";

//Adicioanndo os números da página
function getPaginationItems(
  currentPage: number,
  totalPages: number,
): (number | "ellipsis")[] {
  const pages = [
    ...new Set(
      [1, currentPage - 1, currentPage, currentPage + 1, totalPages].filter(
        (page) => page >= 1 && page <= totalPages,
      ),
    ),
  ].sort((a, b) => a - b);

  return pages.flatMap((page, index) => {
    if (index === 0) return [page];

    const previousPage = pages[index - 1];
    const gap = page - previousPage;

    if (gap === 2) return [previousPage + 1, page];
    if (gap > 2) return ["ellipsis", page];

    return [page];
  });
}

//Seção inicial do front, com o texto de boas vindas e o formulário de pesquisa
export function SearchSection({
  results,
  ratings,
  loading,
  genres,
  genresLoading,
  genresError,
  detailsLoading,
  hasSearched,
  error,
  onSearch,
  onClearSearch,
  onSelectMovie,
  currentPage,
  totalPages,
  onPageChange,
}: SearchSectionProps) {
  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<MovieSortOrder>("relevance");
  const [selectedGenreId, setSelectedGenreId] = useState("");

  // Filtra os resultados carregados na página atual pelo gênero selecionado.
  const filteredResults = useMemo(() => {
    if (!selectedGenreId) return results;

    const genreId = Number(selectedGenreId);
    return results.filter((movie) => movie.genre_ids.includes(genreId));
  }, [results, selectedGenreId]);

  // Ordena os resultados filtrados sem alterar a busca nem a paginação do TMDB.
  const sortedResults = useMemo(() => {
    if (sortOrder === "relevance") return filteredResults;

    return [...filteredResults].sort((first, second) => {
      const firstDate = first.release_date || "";
      const secondDate = second.release_date || "";

      if (!firstDate) return 1;
      if (!secondDate) return -1;

      return sortOrder === "newest"
        ? secondDate.localeCompare(firstDate)
        : firstDate.localeCompare(secondDate);
    });
  }, [filteredResults, sortOrder]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch(query.trim());
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
                setQuery("");
                onClearSearch();
              }}
            >
              <FiX className="size-4" aria-hidden="true" />
            </button>
          )}
          <Button className="shrink-0" type="submit">
            {loading ? "Buscando..." : "Buscar"}
          </Button>
        </form>

        {/* Filtro para ordenar os resultados sem alterar o campo de busca */}
        <div className="mt-3 flex flex-nowrap items-center justify-between gap-1.5 sm:flex-wrap sm:justify-end sm:gap-3">
          <SelectInput
            id="movie-genre"
            label="Gênero"
            value={selectedGenreId}
            disabled={genresLoading || genres.length === 0}
            onChange={setSelectedGenreId}
            options={[
              {
                value: "",
                label: genresLoading ? "Carregando..." : "Todos os gêneros",
              },
              ...genres.map((genre) => ({
                value: String(genre.id),
                label: genre.name,
              })),
            ]}
          />

          <SelectInput
            id="movie-sort"
            label="Ordenar por"
            value={sortOrder}
            onChange={(value) => {
              if (
                value === "relevance" ||
                value === "newest" ||
                value === "oldest"
              ) {
                setSortOrder(value);
              }
            }}
            options={[
              { value: "relevance", label: "Relevância" },
              { value: "newest", label: "Mais recentes" },
              { value: "oldest", label: "Mais antigos" },
            ]}
          />

          <button
            type="button"
            disabled={!selectedGenreId && sortOrder === "relevance"}
            onClick={() => {
              setSelectedGenreId("");
              setSortOrder("relevance");
            }}
            className="mb-0.5 shrink-0 whitespace-nowrap rounded-md border border-line px-2 py-2 text-xs text-cream hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50 sm:mb-0 sm:px-3 sm:text-sm"
          >
            <span className="sm:hidden">Limpar</span>
            <span className="hidden sm:inline">Limpar filtros</span>
          </button>
        </div>

        {genresError && (
          <p className="mt-2 text-right text-sm text-danger" role="alert">
            Não foi possível carregar os gêneros: {genresError}
          </p>
        )}

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
            {sortedResults.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">
                {sortedResults.map((movie) => {
                  const rating = ratings.find(
                    (item) => item.tmdb_id === movie.id,
                  );

                  return (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    score={rating?.score}
                    label={`${rating ? "Ver detalhes de" : "Avaliar"} ${movie.title}`}
                    onClick={() => onSelectMovie(movie)}
                  />
                  );
                })}
              </div>
            ) : (
              <p className="text-muted" aria-live="polite">
                Nenhum filme deste gênero foi encontrado nesta página. Tente
                outra página ou escolha “Todos os gêneros”.
              </p>
            )}
            {totalPages > 1 && (
              <nav
                className="mt-8 flex flex-wrap items-center justify-center gap-2"
                aria-label="Paginação dos resultados"
              >
                <button
                  type="button"
                  className="rounded-md border border-line px-3 py-2 text-sm text-cream disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={loading || currentPage === 1}
                  onClick={() => onPageChange(currentPage - 1)}
                >
                  Anterior
                </button>

                {getPaginationItems(currentPage, totalPages).map(
                  (item, index) =>
                    item === "ellipsis" ? (
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
                            ? "border-accent bg-accent text-white"
                            : "border-line text-cream hover:bg-surface"
                        }`}
                        aria-label={`Página ${item}`}
                        aria-current={item === currentPage ? "page" : undefined}
                        disabled={loading}
                        onClick={() => onPageChange(item)}
                      >
                        {item}
                      </button>
                    ),
                )}

                <button
                  type="button"
                  className="rounded-md border border-line px-3 py-2 text-sm text-cream disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={loading || currentPage === totalPages}
                  onClick={() => onPageChange(currentPage + 1)}
                >
                  Próxima
                </button>
              </nav>
            )}
          </div>
        )}
        {hasSearched && !loading && !error && results.length === 0 && (
          <p className="mt-5 text-left text-muted" aria-live="polite">
            Nenhum filme encontrado. Tente buscar por outro título.
          </p>
        )}
      </div>
    </section>
  );
}
