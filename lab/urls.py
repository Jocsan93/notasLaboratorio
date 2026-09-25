from django.contrib import admin
from django.urls import path
from .views import *


urlpatterns = [
    path("lab", main_view, name="main_lab"),
    path("subir", lab_upload_form, name="subir"),
    path("secciones", lab_sections_view, name="lab_sections"),
    path("seccion-estudiantes", lab_section_students_view, name="lab_section_students"),
    path("seccion-estudiantes-excel", lab_section_students_excel_view, name="lab_section_students_excel"),
    path("buscar", lab_search_sections_view, name="lab_search_sections"),
    path("eliminar", lab_delete_view, name="lab_delete"),
    path("depurar",lab_cleanup_view,name="lab_cleanup"),
]