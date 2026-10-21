from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Rating
from .serializers import RatingSerializer


#METODOS HTTP
#Lista de avaliações 
class RatingListView(APIView):
    def get(self, request):
        ratings = Rating.objects.all().order_by("-updated_at") 
        serializer = RatingSerializer(ratings, many=True)  
        return Response(serializer.data)

#Busca a avaliação do filme
class RatingDetailView(APIView):
    def get(self, request, tmdb_id):
        rating = get_object_or_404(Rating, tmdb_id=tmdb_id)
        return Response(RatingSerializer(rating).data)

#Cria ou edita a nota
    def put(self, request, tmdb_id):
        rating = Rating.objects.filter(tmdb_id=tmdb_id).first()  
        data = request.data.copy()  
        data["tmdb_id"] = tmdb_id  
        serializer = RatingSerializer(rating, data=data)  
        serializer.is_valid(raise_exception=True) 
        serializer.save()
        code = status.HTTP_200_OK if rating else status.HTTP_201_CREATED
        return Response(serializer.data, status=code)

#Deleta a avaliação
    def delete(self, request, tmdb_id):
        rating = get_object_or_404(Rating, tmdb_id=tmdb_id)
        rating.delete()
        return Response(status=status.HTTP_204_NO_CONTENT) 