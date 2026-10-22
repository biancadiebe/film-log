import type { MovieDetails, MovieSearchResult, Rating } from "../data/types";

// API do backend: configure VITE_API_BASE_URL para substituir a URL local de desenvolvimento.
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api"
).replace(/\/+$/, "");

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw error;
    }
    throw new Error(
      "Não foi possível conectar ao backend. Verifique se o servidor está em execução.",
    );
  }

  const body = await response.text();
  let data: unknown;

  try {
    data = body ? JSON.parse(body) : null;
  } catch {
    throw new Error(
      response.ok
        ? "A API retornou uma resposta inválida."
        : `Falha na API (HTTP ${response.status}).`,
    );
  }

  if (!response.ok) {
    const detail =
      typeof data === "object" &&
      data !== null &&
      "detail" in data &&
      typeof data.detail === "string"
        ? data.detail
        : `Falha na API (HTTP ${response.status}).`;
    throw new Error(detail);
  }

  return data as T;
}

export async function searchMovies(
  query: string,
  signal?: AbortSignal,
): Promise<MovieSearchResult[]> {
  const params = new URLSearchParams({ query });
  const result = await request<{ results: MovieSearchResult[] }>(
    `/movies/search/?${params.toString()}`,
    { signal },
  );
  if (!Array.isArray(result.results)) {
    throw new Error("A API retornou uma lista de filmes inválida.");
  }
  return result.results;
}

export function getMovieDetails(tmdbId: number): Promise<MovieDetails> {
  return request<MovieDetails>(`/movies/${tmdbId}/`);
}

export async function getRatings(): Promise<Rating[]> {
  const ratings = await request<Rating[]>("/ratings/");
  if (!Array.isArray(ratings)) {
    throw new Error("A API retornou uma lista de avaliações inválida.");
  }
  return ratings;
}

export function saveRating(
  movie: MovieDetails,
  score: number,
): Promise<Rating> {
  return request<Rating>(`/ratings/${movie.id}/`, {
    method: "PUT",
    body: JSON.stringify({
      tmdb_id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path ?? "",
      score,
    }),
  });
}

export async function deleteRating(tmdbId: number): Promise<void> {
  await request<null>(`/ratings/${tmdbId}/`, { method: "DELETE" });
}

export function posterUrl(path: string | null, size = "w500"): string | null {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
}
