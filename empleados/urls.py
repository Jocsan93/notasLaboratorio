from django.contrib import admin
from django.urls import path
from .views import *


urlpatterns = [
    path("empleados", main_view, name="main_empleados"),
    path("subir", empleados_upload_view, name="empleados_upload"),
]