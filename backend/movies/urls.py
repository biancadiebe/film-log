#Rotas
from django.urls import path
from .views import MovieDetailView, MovieSearchView

urlpatterns = [
    path("movies/search/", MovieSearchView.as_view()),
    path("movies/<int:tmdb_id>/", MovieDetailView.as_view()),
]