from django.contrib import admin
from django.urls import path
from users.views import *
from theory.views import main_view as theory_main_view
from theory.views import *


urlpatterns = [
    path('login', loginView, name="login"),
    path('logout', logoutView, name="logout"),
    path('perfil', profileView, name="perfil"),
    path('admin', perfilAdminView, name="perfil_admin"),
    path('adminRegister', adminRegisterView, name="usuarios_admin"),
    path("admin/registrar-form/", admin_registration_form, name="admin_registration_form"),
    path("instructor/registrar-form/", instructor_registration_form, name="instructor_registration_form"),
    path("professor/registrar-form/", professor_registration_form, name="professor_registration_form"),
    path("student/registrar-form/", student_registration_form, name="student_registration_form"),
    path("theory", theory_main_view, name="main_theory"),
]