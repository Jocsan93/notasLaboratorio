from django.contrib import admin
from django.urls import path
from landing import views as landingViews

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', landingViews.index, name=""),
    path('sobreNosotros', landingViews.aboutUs, name="sobreNosotros"),
]
