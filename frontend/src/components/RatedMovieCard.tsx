import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import type { Rating } from '../data/types'
import { MoviePoster, RatingStars } from './MoviePoster'

type RatedMovieCardProps = {
  rating: Rating
  onOpen: (rating: Rating) => void
  onEdit: (rating: Rating) => void
  onDelete: (rating: Rating) => void
  deleting: boolean
}

// Frontend card for backend-saved ratings, with edit and delete actions.
export function RatedMovieCard({
  rating,
  onOpen,
  onEdit,
  onDelete,
  deleting,
}: RatedMovieCardProps) {
  return (
    <article className="min-w-0">
      <button
        className="group block w-full cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4"
        type="button"
        aria-label={`Ver detalhes de ${rating.title}`}
        onClick={() => onOpen(rating)}
      >
        <MoviePoster
          movie={rating}
          className="aspect-[2/3] w-full transition-transform duration-200 group-hover:-translate-y-1 group-hover:border-accent"
        />
      </button>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="truncate text-base font-bold text-cream sm:text-lg">
            {rating.title}
          </h2>
        </div>
        <div className="flex shrink-0 gap-1">
          <button
            className="flex size-8 cursor-pointer items-center justify-center rounded-md text-muted transition-colors hover:bg-surface hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
            type="button"
            aria-label={`Editar avaliação de ${rating.title}`}
            onClick={() => onEdit(rating)}
          >
            <FiEdit2 aria-hidden="true" />
          </button>
          <button
            className="flex size-8 cursor-pointer items-center justify-center rounded-md text-muted transition-colors hover:bg-surface hover:text-danger focus-visible:outline-2 focus-visible:outline-danger disabled:cursor-wait disabled:opacity-50"
            type="button"
            aria-label={`Excluir avaliação de ${rating.title}`}
            disabled={deleting}
            onClick={() => onDelete(rating)}
          >
            <FiTrash2 aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="mt-2">
        <RatingStars score={rating.score} />
      </div>
    </article>
  )
}
