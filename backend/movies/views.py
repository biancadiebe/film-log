from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

# Importa as funções e os erros que criamos no arquivo tmdb.py
from .tmdb import TMDBError, TMDBNotFound, get_movie_details, search_movies

#Le a busca na URL, chama a classe search_movies e retorna a lista de filmes em JSON
class MovieSearchView(APIView):
    def get(self, request):
        query = request.query_params.get("query", "").strip()
        if not query:
            return Response(
                {"detail": "The 'query' parameter is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            page = max(1, int(request.query_params.get("page", 1)))
        except ValueError:
            page = 1

        try:
            return Response(search_movies(query, page))
        except TMDBError:
            return Response(
                {"detail": "Could not fetch data from TMDB."},
                status=status.HTTP_502_BAD_GATEWAY,
            )

#Chama get_movie_details, recebe o ID do filme pela URL e devolve os dados completos (sinopse, data, gênero e elenco)
class MovieDetailView(APIView):
    def get(self, request, tmdb_id):
        try:
            return Response(get_movie_details(tmdb_id))
        except TMDBNotFound:  
            return Response({"detail": "Movie not found."}, status=status.HTTP_404_NOT_FOUND)
        except TMDBError:
            return Response(
                {"detail": "Could not fetch data from TMDB."},
                status=status.HTTP_502_BAD_GATEWAY,
            )