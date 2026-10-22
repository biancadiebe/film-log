// Tipos do frontend alinhados ao JSON retornado pelos endpoints do backend.
export type Page = 'buscar' | 'avaliados'

//Resposta paginada
export type MovieSearchResponsePages = {
  page: number
  total_pages: number
  total_results: number
  results: MovieSearchResult[]
}

//Card inicial do filme
export type MovieSearchResult = {
  id: number
  title: string
  poster_path: string | null
  release_date: string
  genre_ids: number[]
}

//Detalhes do filme
export type MovieDetails = {
  id: number
  title: string
  overview: string
  release_date: string
  poster_path: string | null
  genres: string[]
  cast: MovieCastMember[]
}

//Elenco
export type MovieCastMember = {
  name: string
  character: string
  profile_path: string | null
}

//Avaliação
export type Rating = {
  tmdb_id: number
  title: string
  poster_path: string
  score: number
  created_at: string
  updated_at: string
}

//Genero dos filmes
export type MovieGenre = {
  id: number
  name: string
}