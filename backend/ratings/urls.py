#Liga o endereço do backend com o frontend (configura as rotas)

from django.urls import path
from .views import RatingDetailView, RatingListView

urlpatterns = [
    path("ratings/", RatingListView.as_view()),
    path("ratings/<int:tmdb_id>/", RatingDetailView.as_view()), 
]