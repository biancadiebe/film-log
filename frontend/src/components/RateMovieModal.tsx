import { useState } from 'react'
import { FiStar, FiX } from 'react-icons/fi'
import { Button } from './Button'
import type { MovieDetails } from '../data/types'

type RateMovieModalProps = {
  movie: MovieDetails
  initialScore: number
  saving: boolean
  error: string | null
  onClose: () => void
  onSave: (score: number) => void
}

// Frontend rating dialog; the selected score is saved through the backend API.
export function RateMovieModal({
  movie,
  initialScore,
  saving,
  error,
  onClose,
  onSave,
}: RateMovieModalProps) {
  const [selectedScore, setSelectedScore] = useState(initialScore)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-page/80 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <section
        className="relative max-h-[calc(100vh-24px)] w-full max-w-[620px] overflow-y-auto rounded-xl border border-line bg-surface p-6 shadow-2xl sm:max-h-[calc(100vh-64px)] sm:p-9"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rate-movie-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 flex size-10 cursor-pointer items-center justify-center rounded-full border border-line text-muted transition-colors hover:text-cream focus-visible:outline-2 focus-visible:outline-cream"
          type="button"
          aria-label="Fechar avaliação"
          disabled={saving}
          onClick={onClose}
        >
          <FiX aria-hidden="true" />
        </button>

        <p className="text-xs font-extrabold tracking-[1.8px] text-muted uppercase">
          {initialScore ? 'Editar avaliação' : 'Avaliar filme'}
        </p>
        <h2
          id="rate-movie-title"
          className="mt-3 pr-10 font-serif text-3xl leading-tight font-extrabold text-cream sm:text-4xl"
        >
          {movie.title}
        </h2>
        <p className="mt-2 text-sm text-muted">
          {movie.release_date
            ? new Date(`${movie.release_date}T00:00:00`).getFullYear()
            : 'Ano indisponível'}
        </p>
        <p className="mt-5 leading-7 text-cream/90">
          {movie.overview || 'Sinopse indisponível.'}
        </p>

        <div className="mt-7">
          <p className="text-sm font-semibold text-muted">
            Qual nota você dá para este filme?
          </p>
          <div className="mt-3 flex gap-2" role="group" aria-label="Escolha uma nota">
            {Array.from({ length: 5 }, (_, index) => {
              const starValue = index + 1
              const selected = starValue <= selectedScore

              return (
                <button
                  key={starValue}
                  className="cursor-pointer rounded p-1 text-star transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-cream disabled:cursor-wait"
                  type="button"
                  aria-label={`${starValue} ${starValue === 1 ? 'estrela' : 'estrelas'}`}
                  aria-pressed={selectedScore === starValue}
                  disabled={saving}
                  onClick={() => setSelectedScore(starValue)}
                >
                  <FiStar
                    className={`size-8 ${selected ? 'fill-star' : 'text-line'}`}
                    aria-hidden="true"
                  />
                </button>
              )
            })}
          </div>
          <p className="mt-2 min-h-5 text-sm text-muted" aria-live="polite">
            {selectedScore > 0
              ? `Nota selecionada: ${selectedScore}/5`
              : 'Selecione uma nota'}
          </p>
        </div>

        {error && (
          <p className="mt-4 text-sm text-danger" role="alert">
            {error}
          </p>
        )}
        {saving && (
          <p className="mt-4 text-sm text-muted" aria-live="polite">
            Salvando avaliação...
          </p>
        )}
        <div className="mt-6 flex justify-end">
          <Button
            disabled={saving || selectedScore === 0}
            onClick={() => onSave(selectedScore)}
          >
            {saving ? 'Salvando...' : 'Salvar avaliação'}
          </Button>
        </div>
      </section>
    </div>
  )
}
