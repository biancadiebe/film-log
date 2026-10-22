#Rotas
from django.urls import path
from .views import MovieDetailView, MovieGenreListView, MovieSearchView

urlpatterns = [
    path("movies/genres/", MovieGenreListView.as_view()),
    path("movies/search/", MovieSearchView.as_view()),
    path("movies/<int:tmdb_id>/", MovieDetailView.as_view()),
]