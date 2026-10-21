from django.apps import AppConfig

#Classe de configuração do app ratings
class RatingsConfig(AppConfig):
    #definindo o id automatico dos models
    default_auto_field = "django_mongodb_backend.fields.ObjectIdAutoField"
    name = "ratings"