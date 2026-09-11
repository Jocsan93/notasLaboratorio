from django.contrib import admin
from django.urls import path
from .views import *


urlpatterns = [
    path("theory", main_view, name="main_theory"),
    path("subir", theory_upload_form, name="subir"),
    path( "secciones", theory_sections_view, name="theory_sections"),
    path("seccion-estudiantes", theory_section_students_view, name="theory_section_students"),
    path("seccion-estudiantes-excel", theory_section_students_excel_view, name="theory_section_students_excel"),
    path("buscar", theory_search_view, name="theory_search"),
]