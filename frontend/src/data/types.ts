// Tipos do frontend alinhados ao JSON retornado pelos endpoints do backend.
export type Page = 'buscar' | 'avaliados'

export type MovieSearchResult = {
  id: number
  title: string
  poster_path: string | null
  release_date: string
}

export type MovieDetails = {
  id: number
  title: string
  overview: string
  release_date: string
  poster_path: string | null
  genres: string[]
  cast: MovieCastMember[]
}

export type MovieCastMember = {
  name: string
  character: string
  profile_path: string | null
}

export type Rating = {
  tmdb_id: number
  title: string
  poster_path: string
  score: number
  created_at: string
  updated_at: string
}
