import { FiEdit2, FiStar, FiTrash2, FiX } from "react-icons/fi";
import { posterUrl } from "../services/api";
import { MovieCard, RatingStars } from "./MovieCard";
import { Button } from "./Button";
import type { MovieDetails, Rating } from "../data/types";

type MovieDetailsModalProps = {
  movie: MovieDetails;
  score: number;
  rating: Rating | null;
  editing: boolean;
  saving: boolean;
  deleting: boolean;
  error: string | null;
  onClose: () => void;
  onEdit: () => void;
  onCancelEdit: () => void;
  onScoreChange: (score: number) => void;
  onSave: () => void;
  onDelete: () => void;
};

//Modal com as informações principais do filme (abre quando clica no poster)
export function MovieDetailsModal({
  movie,
  score,
  rating,
  editing,
  saving,
  deleting,
  error,
  onClose,
  onEdit,
  onCancelEdit,
  onScoreChange,
  onSave,
  onDelete,
}: MovieDetailsModalProps) {
  const isBusy = saving || deleting;
  // Sem avaliação: primeira avaliação. Com editing: usuário está alterando a nota.
  const isRating = !rating || editing;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-page/80 p-3 backdrop-blur-sm sm:p-6"
      onClick={() => !isBusy && onClose()}
    >
      <section
        className="relative h-auto max-h-[calc(100dvh-24px)] w-full max-w-308.75 overflow-hidden rounded-xl border border-line bg-surface shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="movie-details-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 z-10 flex size-11 cursor-pointer items-center justify-center rounded-full border border-line bg-page/70 text-muted transition-colors hover:text-cream focus-visible:outline-2 focus-visible:outline-cream sm:top-5 sm:right-5"
          type="button"
          aria-label="Fechar detalhes"
          disabled={isBusy}
          onClick={onClose}
        >
          <FiX className="size-5" aria-hidden="true" />
        </button>

        <div className="grid max-h-[calc(100dvh-48px)] grid-cols-1 gap-4 overflow-y-auto p-3 sm:max-h-[calc(100dvh-72px)] sm:grid-cols-[minmax(180px,0.4fr)_minmax(0,1fr)] sm:gap-6 sm:p-6 lg:grid-cols-[minmax(220px,0.45fr)_minmax(0,1fr)] lg:gap-6 lg:p-8">
          <MovieCard
            variant="poster"
            movie={movie}
            className="mx-auto aspect-2/3 h-auto max-h-[min(32dvh,220px)] w-full max-w-36 self-center sm:max-h-[min(70dvh,560px)] sm:max-w-none"
          />

          <div className="flex min-h-0 min-w-0 flex-col">
            <p className="text-[10px] font-extrabold tracking-[1.2px] text-muted uppercase sm:text-xs sm:tracking-[1.8px]">
              {/* Identifica se é a primeira avaliação, edição ou apenas consulta. */}
              {!rating
                ? "Avaliar filme"
                : editing
                  ? "Editar avaliação"
                  : "Detalhes do filme"}
            </p>
            <h2
              id="movie-details-title"
              className="mt-2 font-serif text-[clamp(22px,3vw,42px)] leading-tight font-extrabold tracking-[-1px] text-cream"
            >
              {movie.title}
            </h2>
            <p className="mt-1.5 text-sm text-muted sm:text-base">
              {movie.release_date}
            </p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {movie.genres.map((genre) => (
                <span
                  key={genre}
                  className="rounded-full border border-line px-2.5 py-1 text-xs font-semibold text-muted sm:text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>

            <div className="mt-4">
              <h3 className="text-[10px] font-extrabold tracking-[1.2px] text-muted uppercase sm:text-xs sm:tracking-[1.8px]">
                Sinopse
              </h3>
              <p className="mt-1.5 text-sm leading-5 text-cream/90 sm:text-base sm:leading-6">
                {movie.overview || "Sinopse indisponível."}
              </p>
            </div>

            <div className="mt-3.5">
              <h3 className="text-[10px] font-extrabold tracking-[1.2px] text-muted uppercase sm:text-xs sm:tracking-[1.8px]">
                Elenco
              </h3>
              <div className="mt-2.5 flex flex-wrap gap-x-2 gap-y-2 sm:gap-x-3">
                {movie.cast.map((person) => (
                  <div
                    className="flex w-16 flex-col items-center text-center sm:w-20"
                    key={person.name}
                  >
                    <div
                      className="size-9 overflow-hidden rounded-full border border-line bg-surface sm:size-11"
                      role="img"
                      aria-label={`Retrato ilustrativo de ${person.name}`}
                    >
                      {person.profile_path && (
                        <img
                          className="size-full object-cover"
                          src={posterUrl(person.profile_path, "w185") ?? ""}
                          alt=""
                          loading="lazy"
                        />
                      )}
                    </div>
                    <span className="mt-1.5 max-w-full truncate text-xs font-bold text-cream sm:text-sm">
                      {person.name}
                    </span>
                    <span className="max-w-full truncate text-[10px] text-muted sm:text-xs">
                      {person.character}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5.5 border-t border-line pt-2 sm:pt-3">
              <h3 className="text-[10px] font-extrabold tracking-[1.2px] text-muted uppercase sm:text-xs sm:tracking-[1.8px]">
                {isRating
                  ? "Qual nota você dá para este filme?"
                  : "Sua avaliação"}
              </h3>
              {/* Primeira avaliação e edição permitem escolher estrelas; consulta só mostra a nota salva. */}
              {isRating ? (
                <>
                  <div
                    className="mt-1.5 flex gap-1 sm:gap-2"
                    role="group"
                    aria-label="Escolha uma nota"
                  >
                    {Array.from({ length: 5 }, (_, index) => {
                      const starValue = index + 1;
                      const selected = starValue <= score;

                      return (
                        <button
                          key={starValue}
                          className="cursor-pointer rounded p-0.5 text-star transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-cream disabled:cursor-wait sm:p-1"
                          type="button"
                          aria-label={`${starValue} ${starValue === 1 ? "estrela" : "estrelas"}`}
                          aria-pressed={score === starValue}
                          disabled={isBusy}
                          onClick={() => onScoreChange(starValue)}
                        >
                          <FiStar
                            className={`size-6 sm:size-7 ${selected ? "fill-star" : "text-line"}`}
                            aria-hidden="true"
                          />
                        </button>
                      );
                    })}
                  </div>
                  <p
                    className="mt-1.5 min-h-4 text-[10px] text-muted sm:text-xs"
                    aria-live="polite"
                  >
                    {score > 0
                      ? `Nota selecionada: ${score}/5`
                      : "Selecione uma nota"}
                  </p>
                </>
              ) : (
                <div className="mt-1.5 flex items-center gap-2">
                  <RatingStars score={score} />
                  <span className="text-xs font-bold text-star">{score}/5</span>
                </div>
              )}
              {error && (
                <p className="mt-1.5 text-xs text-danger" role="alert">
                  {error}
                </p>
              )}
              {saving && (
                <p className="mt-1.5 text-xs text-muted" aria-live="polite">
                  Salvando avaliação...
                </p>
              )}
              {isRating ? (
                // Na primeira avaliação ou edição, salva a nota; cancelar só aparece durante edição.
                <div className="mt-2.5 flex flex-wrap justify-end gap-2">
                  {editing && (
                    <button
                      className="inline-flex min-h-9 cursor-pointer items-center rounded-md border border-line px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:text-cream focus-visible:outline-2 focus-visible:outline-cream disabled:cursor-wait disabled:opacity-50"
                      type="button"
                      disabled={isBusy}
                      onClick={onCancelEdit}
                    >
                      Cancelar
                    </button>
                  )}
                  <Button disabled={isBusy || score === 0} onClick={onSave}>
                    {saving ? "Salvando..." : "Salvar avaliação"}
                  </Button>
                </div>
              ) : (
                // No modo de consulta, oferece as ações de editar ou excluir a avaliação existente.
                <div className="mt-2.5 flex flex-wrap gap-2">
                  <button
                    className="inline-flex min-h-9 cursor-pointer items-center gap-2 rounded-md border border-line px-3 py-1.5 text-xs font-semibold text-cream transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-accent disabled:cursor-wait disabled:opacity-50"
                    type="button"
                    aria-label={`Editar avaliação de ${rating.title}`}
                    disabled={isBusy}
                    onClick={onEdit}
                  >
                    <FiEdit2 aria-hidden="true" />
                    Editar avaliação
                  </button>
                  <button
                    className="inline-flex min-h-9 cursor-pointer items-center gap-2 rounded-md border border-line px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-danger hover:text-danger focus-visible:outline-2 focus-visible:outline-danger disabled:cursor-wait disabled:opacity-50"
                    type="button"
                    aria-label={`Excluir avaliação de ${rating.title}`}
                    disabled={isBusy}
                    onClick={onDelete}
                  >
                    <FiTrash2 aria-hidden="true" />
                    {deleting ? "Excluindo..." : "Excluir avaliação"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
