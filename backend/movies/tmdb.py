import requests
from django.conf import settings

TMDB_BASE_URL = "https://api.themoviedb.org/3"
TMDB_LANGUAGE = "pt-BR"  


class TMDBError(Exception):
    """Falha ao falar com o TMDB (fora do ar,  chave inválida etc.)."""


class TMDBNotFound(TMDBError):
    """O TMDB respondeu que o filme não existe."""

#Faz a requisição HTTP e retorna a resposta em JSON (unica função que se comunica com TMDB)
def _get(path, params=None):
    if not settings.TMDB_API_KEY:
        raise TMDBError("Chave de API do TMDB não foi configurada")
    query = {"api_key": settings.TMDB_API_KEY, "language": TMDB_LANGUAGE}
    if params:
        query.update(params)  

    try:
        #Desiste se o TMDB não responder em 10 segundos
        response = requests.get(f"{TMDB_BASE_URL}{path}", params=query, timeout=10)
    except requests.RequestException:
        raise TMDBError("Não foi possível alcançar o TMDB") from None

    if response.status_code == 404:
        raise TMDBNotFound("Filme não encontrado")
    if not response.ok: 
        raise TMDBError(f"TMDB respondeu com status {response.status_code}")

    return response.json() #JSON completo do TMDB 

#Busca filmes no TMDB pelo padrão digitado e retorna os campos filtrados no front
def search_movies(query, page=1):
    data = _get("/search/movie", {"query": query, "page": page, "include_adult": "false"})
    return {
        "page": data["page"],
        "total_pages": data["total_pages"],
        "total_results": data["total_results"],
        "results": [
            {
                "id": movie["id"],
                "title": movie["title"],
                "poster_path": movie["poster_path"],
                "release_date": movie.get("release_date", ""),
            }
            for movie in data["results"]  
        ],
    }

#Busca os dados completos de um filme específico, incluindo o elenco
def get_movie_details(tmdb_id):
    data = _get(f"/movie/{tmdb_id}", {"append_to_response": "credits"})
    return {
        "id": data["id"],
        "title": data["title"],
        "overview": data.get("overview", ""),
        "release_date": data.get("release_date", ""),
        "poster_path": data.get("poster_path"),
        "genres": [genre["name"] for genre in data.get("genres", [])],
        "cast": [
            {
                "name": person["name"],
                "character": person.get("character", ""),
                "profile_path": person.get("profile_path"),
            }
            for person in data.get("credits", {}).get("cast", [])[:6]  
        ],
    }