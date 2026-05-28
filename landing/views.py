from django.shortcuts import render

#pagina de inicio
def index(request):
    return render(request, "index.html", {})

#pagina sobre nosotros
def aboutUs(request):
    return render(request, "aboutUs.html", {})   

#pagina contactanos
def contact(request):
    return render(request, "contact.html", {})     
