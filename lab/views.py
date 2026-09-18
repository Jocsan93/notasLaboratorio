import pandas as pd
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from functools import wraps
from django.contrib.auth.views import redirect_to_login
from django.core.exceptions import PermissionDenied
from .forms import LabUploadForm
from django.core.paginator import Paginator
from io import BytesIO
import openpyxl
from django.http import HttpResponse, JsonResponse

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
    return render(request, 'lab/lab.html')


@login_required
@admin_required
def lab_upload_form(request):

    if request.method == "POST":

        form = LabUploadForm(
            request.POST,
            request.FILES
        )

        if form.is_valid():

            archivo = form.cleaned_data["archivo"]

            try:

                excel = pd.read_excel(
                    archivo,
                    sheet_name=None
                )

                hojas = []

                for nombre_hoja, df in excel.items():

                    hojas.append({
                        "nombre": nombre_hoja,
                        "columnas": list(df.columns),
                        "filas": len(df)
                    })

                return render(
                    request,
                    "lab/lab_upload_form.html",
                    {
                        "form": form,
                        "hojas": hojas
                    }
                )

            except Exception as e:

                print(
                    "Error al leer el Excel:",
                    e
                )

    else:

        form = LabUploadForm()

    return render(
        request,
        "lab/lab_upload_form.html",
        {
            "form": form
        }
    )