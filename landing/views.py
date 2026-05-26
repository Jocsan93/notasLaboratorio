from django.shortcuts import render

#pagina de inicio
def index(request):
    return render(request, "index.html", {})
