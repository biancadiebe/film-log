from rest_framework import serializers
from .models import Rating


#Se baseia de um model (já sabe os campos) para transformar em JSON
class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating  
        fields = ["tmdb_id", "title", "poster_path", "score", "created_at", "updated_at"]
        read_only_fields = ["created_at", "updated_at"] #preenche automatico