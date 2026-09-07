from django.contrib import admin
from django.urls import include, path
from landing import views as landingViews

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', landingViews.index, name=""),
    path('sobreNosotros', landingViews.aboutUs, name="sobreNosotros"),
    path('Contactanos', landingViews.contact, name="contactanos"),
    path('users/', include('users.urls')),
    path('theory/', include('theory.urls')),
]
