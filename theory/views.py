import pandas as pd
from django.contrib.auth.decorators import login_required, user_passes_test
from django.shortcuts import render
from .forms import TheoryUploadForm
from functools import wraps
from django.contrib.auth.views import redirect_to_login
from django.core.exceptions import PermissionDenied



def admin_required(view_func):

    @wraps(view_func)
    def wrapper(request, *args, **kwargs):

        if not request.user.is_authenticated:

            return redirect_to_login(
                request.get_full_path()
            )

        if request.user.role != request.user.Roles.ADMINISTRADOR:

            raise PermissionDenied

        return view_func(request, *args, **kwargs)

    return wrapper

@login_required
@admin_required
def main_view(request):
    return render(request, 'theory/theory.html')



@login_required
@admin_required
def theory_upload_form(request):
    print("MÉTODO RECIBIDO:", request.method)

    if request.method == "POST":

        form = TheoryUploadForm(
            request.POST,
            request.FILES
        )
        if form.is_valid():

            archivo = form.cleaned_data["archivo"]

            try:

                df = pd.read_excel(archivo)

                print("\n==============================")
                print("COLUMNAS DEL EXCEL")
                print("==============================")

                print(df.columns.tolist())


                print("\n==============================")
                print("CANTIDAD DE FILAS")
                print("==============================")

                print(len(df))


                print("\n==============================")
                print("PRIMERAS FILAS")
                print("==============================")

                print(df.head())


            except Exception as e:

                print(
                    "Error al leer el Excel:",
                    e
                )

    else:

        form = TheoryUploadForm()


    return render(
        request,
        "theory/theory_upload_form.html",
        {
            "form": form
        }
    )