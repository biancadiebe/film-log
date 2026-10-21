FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1

WORKDIR /app

#Copia o requirements.txt para facilitar a instalação das bibliotecas
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

#Copia o resto do código
COPY . .

#Porta
EXPOSE 8000

#Aplica as migrações e sobe o servidor Django na porta 8000, acessível de qualquer IP
CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]