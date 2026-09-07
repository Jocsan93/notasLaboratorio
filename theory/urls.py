from django.contrib import admin
from django.urls import path
from .views import *


urlpatterns = [
    path("theory", main_view, name="main_theory"),
    path("subir", theory_upload_form, name="subir")
]