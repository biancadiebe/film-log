import { FiFilm } from 'react-icons/fi'

export function EmptyResultsSection() {
  return (
    <section
      id="resultados"
      className="flex min-h-[calc(100vh-72px)] flex-col items-center px-5 pt-12 pb-16 text-center sm:min-h-[calc(100vh-87px)] sm:px-6 sm:pt-16.5"
      aria-labelledby="empty-state-title"
    >
      <div
        className="flex h-25 w-37.5 items-center justify-center gap-6.25 border-y border-line/50"
        aria-hidden="true"
      >
        <span className="size-3.75 rounded-full bg-star shadow-[0_0_18px_var(--color-star)]" />
        <FiFilm className="size-3.75 text-accent drop-shadow-[0_0_8px_var(--color-accent)]" />
        <span className="size-3.75 rounded-full bg-star shadow-[0_0_18px_var(--color-star)]" />
      </div>
      <h2
        id="empty-state-title"
        className="mt-10 max-w-135 font-serif text-[32px] leading-[1.2] font-extrabold tracking-[-0.8px] text-cream sm:text-[38px]"
      >
        Seu próximo filme está aqui.
      </h2>
      <p className="mt-4.5 text-base leading-normal text-muted sm:text-lg">
        Busque por um título ou gênero para começar.
      </p>
    </section>
  )
}
