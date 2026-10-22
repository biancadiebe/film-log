import os
from pathlib import Path
from dotenv import load_dotenv

# Define caminhos dentro do projeto, como BASE_DIR / 'subdiretório'.
BASE_DIR = Path(__file__).resolve().parent.parent

#Le o .env 
load_dotenv(BASE_DIR / ".env")

# Configurações iniciais de desenvolvimento — não são adequadas para produção.

# AVISO DE SEGURANÇA: mantenha em segredo a chave secreta usada em produção!
SECRET_KEY = 'django-insecure-g8-$pgc&tz^$q4)5_eu61aj!#tb=-!w7on*l17m8j#xs(2enc_'

# AVISO DE SEGURANÇA: não deixe a opção de depuração ativada em produção!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition - tudo que é instalado é colocado aqui

INSTALLED_APPS = [
    'config.apps.MongoAdminConfig',
    'config.apps.MongoAuthConfig',
    'config.apps.MongoContentTypesConfig',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django_mongodb_backend',
    "rest_framework",
    "corsheaders",
    "ratings", 
    "movies",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'


# Banco de dados
#atualizando para o projeto do mongodb (filmlog)
DATABASES = {
    "default": {
        "ENGINE": "django_mongodb_backend",
        # Permite que o host leia uma variável de ambiente, facilitando a troca de ambiente e mantendo o mesmo padrão.
        "HOST": os.environ.get("MONGO_URL", "mongodb://localhost:27017"), 
        "NAME": "filmlog",
    },
}

# Roteadores de banco de dados
DATABASE_ROUTERS = ["django_mongodb_backend.routers.MongoRouter"]

# Validação de senha

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internacionalização
# https://docs.djangoproject.com/en/6.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Arquivos estáticos (CSS, JavaScript, imagens)
# https://docs.djangoproject.com/en/6.0/howto/static-files/

STATIC_URL = 'static/'

# Tipo padrão do campo de chave primária
# https://docs.djangoproject.com/en/6.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django_mongodb_backend.fields.ObjectIdAutoField'

MIGRATION_MODULES = {
    'admin': 'mongo_migrations.admin',
    'auth': 'mongo_migrations.auth',
    'contenttypes': 'mongo_migrations.contenttypes',
}

# Busca a variável e devolve um texto vazio em vez de gerar um erro.
TMDB_API_KEY = os.environ.get("TMDB_API_KEY", "")

# Endereços de onde o navegador pode chamar a API (o endereço do front)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]