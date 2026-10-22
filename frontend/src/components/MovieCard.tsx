import { FiFilm, FiStar } from "react-icons/fi";
import { posterUrl } from "../services/api";
import type { Rating } from "../data/types";

type Movie = {
  title: string;
  poster_path: string | null;
  release_date?: string;
};

type MovieCardProps =
  | {
      variant?: "card";
      movie: Movie;
      score?: Rating["score"];
      label: string;
      onClick: () => void;
      className?: string;
    }
  | {
      variant: "poster";
      movie: Movie;
      className?: string;
    };

//Cards dos filmes - Poster e titulo + se ter um score cadastrado, aparecem as estrelas
export function MovieCard(props: MovieCardProps) {
  const { movie } = props;
  const imageUrl = posterUrl(movie.poster_path);
  // Pega o ano da data de lançamento para exibir como referência no pôster
  const releaseYear = movie.release_date?.slice(0, 4);
  const hasReleaseYear = releaseYear ? /^\d{4}$/.test(releaseYear) : false;
  const posterClassName =
    props.variant === "poster"
      ? (props.className ?? "")
      : "aspect-2/3 w-full transition-transform duration-200 group-hover:-translate-y-1 group-hover:border-accent";

  const poster = (
    <div
      className={`relative flex overflow-hidden rounded-lg border border-line bg-linear-to-br from-surface via-page to-surface ${posterClassName}`}
      aria-label={`Pôster de ${movie.title}`}
      role="img"
    >
      {imageUrl ? (
        <img
          className="absolute inset-0 size-full object-cover"
          src={imageUrl}
          alt=""
          loading="lazy"
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <FiFilm className="size-10 text-muted/50" />
        </div>
      )}
      {hasReleaseYear && (
        <span
          className="absolute top-2 right-2 rounded bg-page/90 px-2 py-1 text-xs font-bold text-cream shadow"
          aria-hidden="true"
        >
          {releaseYear}
        </span>
      )}
    </div>
  );

  if (props.variant === "poster") {
    return poster;
  }

  const { score, label, onClick } = props;

  return (
    <article className="min-w-0">
      <button
        className="group block w-full cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4"
        type="button"
        aria-label={label}
        onClick={onClick}
      >
        {poster}
      </button>
      <div className="mt-3 min-w-0">
        <h2 className="truncate text-base font-bold text-cream sm:text-lg">
          {movie.title}
        </h2>
      </div>
      {score !== undefined && (
        <div className="mt-2">
          <RatingStars score={score} />
        </div>
      )}
    </article>
  );
}

export function RatingStars({ score }: { score: number }) {
  return (
    <div
      className="flex items-center gap-1"
      aria-label={`Nota: ${score} de 5 estrelas`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <FiStar
          key={index}
          aria-hidden="true"
          className={`size-4 ${index < score ? "fill-star text-star" : "text-line"}`}
        />
      ))}
    </div>
  );
}
