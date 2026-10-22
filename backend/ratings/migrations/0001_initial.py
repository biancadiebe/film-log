# Gerado pelo Django 6.0.9 em 2026-10-21 00:06

import django.core.validators
import django_mongodb_backend.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Rating',
            fields=[
                ('id', django_mongodb_backend.fields.ObjectIdAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tmdb_id', models.IntegerField(unique=True)),
                ('title', models.CharField(max_length=255)),
                ('poster_path', models.CharField(blank=True, max_length=255)),
                ('score', models.PositiveSmallIntegerField(validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(5)])),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
    ]
