from django.contrib import admin
from django.urls import path
from .views import *


urlpatterns = [
    path("empleados", main_view, name="main_empleados"),
    path("subir", empleados_upload_view, name="empleados_upload"),
    path("eliminar-todos", empleados_delete_all_view, name="empleados_delete_all"),
    path("lista", empleados_list_view, name="empleados_list"),
    path("detalle", empleados_detail_view, name="empleados_detail"),
    path("modificar", empleados_update_view, name="empleados_update"),
    path("buscar", empleados_search_view, name="empleados_search"),
]