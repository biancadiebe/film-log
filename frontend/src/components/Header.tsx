import type { Page } from '../data/types'

type HeaderProps = {
  activePage: Page
  onNavigate: (page: Page) => void
}

export function Header({ activePage, onNavigate }: HeaderProps) {
  const navClass = (page: Page) =>
    `relative inline-flex cursor-pointer items-center text-[11px] font-extrabold tracking-[0.6px] uppercase focus-visible:outline-2 focus-visible:outline-cream focus-visible:outline-offset-4 sm:text-sm sm:tracking-[1px] ${
      activePage === page
        ? "text-accent after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-accent after:content-['']"
        : 'text-muted transition-colors hover:text-accent'
    }`

  return (
    <header className="flex h-[72px] items-stretch justify-between border-b border-line px-5 sm:h-[87px] sm:px-[max(32px,calc((100%-1478px)/2))]">
      <a
        className="inline-flex items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-cream focus-visible:outline-offset-4 sm:gap-3"
        href="#inicio"
        aria-label="FilmLog - início"
        onClick={() => onNavigate('buscar')}
      >
        <span className="isolate inline-flex items-center" aria-hidden="true">
          <span className="mr-[-7px] size-[17px] rounded-full border border-page/45 bg-star sm:size-5" />
          <span className="mr-[-7px] size-[17px] rounded-full border border-page/45 bg-accent sm:size-5" />
          <span className="size-[17px] rounded-full border border-page/45 bg-cream sm:size-5" />
        </span>
        <span className="font-serif text-[23px] font-extrabold tracking-[-1.2px] sm:text-[28px]">
          FilmLog
        </span>
      </a>

      <nav
        className="flex items-stretch gap-[18px] sm:gap-[38px]"
        aria-label="Navegação principal"
      >
        <button
          className={navClass('buscar')}
          type="button"
          aria-current={activePage === 'buscar' ? 'page' : undefined}
          onClick={() => onNavigate('buscar')}
        >
          Buscar
        </button>
        <button
          className={navClass('avaliados')}
          type="button"
          aria-current={activePage === 'avaliados' ? 'page' : undefined}
          onClick={() => onNavigate('avaliados')}
        >
          Avaliados
        </button>
      </nav>
    </header>
  )
}
