import { FiFilm, FiStar } from 'react-icons/fi'
import { posterUrl } from '../data/api'

// Frontend presentation for rating stars and poster art supplied by the API.
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
          className={`size-4 ${index < score ? 'fill-star text-star' : 'text-line'}`}
        />
      ))}
    </div>
  )
}

export function MoviePoster({
  movie,
  className = '',
}: {
  movie: { title: string; poster_path: string | null }
  className?: string
}) {
  const imageUrl = posterUrl(movie.poster_path)

  return (
    <div
      className={`relative flex overflow-hidden rounded-lg border border-line bg-gradient-to-br from-surface via-page to-surface ${className}`}
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
        <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
          <FiFilm className="size-10 text-muted/50" />
        </div>
      )}
      <div className="relative mt-auto w-full bg-gradient-to-t from-page/95 via-page/55 to-transparent px-4 pt-16 pb-5">
        <FiFilm className="mb-3 size-5 text-cream/80" aria-hidden="true" />
        <p className="font-serif text-lg leading-tight font-extrabold text-cream sm:text-xl">
          {movie.title}
        </p>
      </div>
    </div>
  )
}
