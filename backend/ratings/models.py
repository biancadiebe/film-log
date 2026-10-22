from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

# Crie seus modelos aqui.

#Model: classe em python que descreve quais dados que são guardados no banco (Cada classe vira uma coleção no banco)
class Rating(models.Model):
    tmdb_id = models.IntegerField(unique=True) #id do filme, não pode ser avaliado duas vezes
    title = models.CharField(max_length=255) #titulo do filme
    poster_path = models.CharField(max_length=255, blank=True) #poster do filme
    score = models.PositiveSmallIntegerField( #delimita o score de 1 a 5
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    created_at = models.DateTimeField(auto_now_add=True) #data
    updated_at = models.DateTimeField(auto_now=True) #django atualiza toda vez que o registro é salvo

#"apresentação" do objeto (ex: Obsessão: 5)
    def __str__(self):
        return f"{self.title}: {self.score}"