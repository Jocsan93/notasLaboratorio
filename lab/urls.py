from django.contrib import admin
from django.urls import path
from .views import *


urlpatterns = [
    path("lab", main_view, name="main_lab"),
]