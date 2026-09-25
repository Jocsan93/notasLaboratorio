import pandas as pd
from django.contrib.auth.decorators import login_required
from .models_django import Empleado
from theory.models_django import TheoryStudent
from django.shortcuts import render
from functools import wraps
from django.contrib.auth.views import redirect_to_login
from django.core.exceptions import PermissionDenied
from .forms import EmpleadoUploadForm
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

# Create your views here.
@login_required
@admin_required
def main_view(request):
    return render(request, "empleados/empleados.html")

@login_required
@admin_required
def empleados_upload_view(request):

    registros = Empleado.objects.count()


    print("\n")
    print("========== EMPLEADOS ==========")
    print(
        "Cantidad de empleados:",
        registros
    )
    print("================================")
    print("\n")


    if registros > 0:

        return render(
            request,
            "empleados/empleados_upload_form.html",
            {
                "registros_existentes": True,
                "cantidad_registros": registros
            }
        )


    if request.method == "POST":

        form = EmpleadoUploadForm(
            request.POST,
            request.FILES
        )


        if form.is_valid():

            archivo = form.cleaned_data["archivo"]


            try:

                df = pd.read_excel(
                    archivo,
                    sheet_name="Usuarios"
                )


                df = df.drop(
                    columns=[
                        "Numero",
                        "Correo 2",
                        "Horario de Entrada",
                        "Hora de Salida",
                        "Labora en otra Empresa",
                        "Nombre de la Empresa",
                        "Tipo de Empresa",
                        "Horario de Entrada.1",
                        "Hora de Salida.1",
                        "Nacionalidad"
                    ]
                )


                # CREAR DOCUMENTOS MONGOENGINE

                documentos = []


                for _, row in df.iterrows():

                    documento = Empleado(

                        departamento=str(
                            row["Departamento"]
                        ),

                        nombre=str(
                            row["Nombre Completo"]
                        ),

                        correo=str(
                            row["Correo 1"]
                        ),

                        genero=str(
                            row["Genero"]
                        ),

                        identidad=str(
                            row["Número de Identidad"]
                        ),

                        contrato=str(
                            row["Contrato"]
                        ),

                        ingreso=str(
                            row["Ingreso"]
                        ),

                        cumpleanos=str(
                            row["Cumpleaños"]
                        ),

                        telefono=str(
                            row["Telefono"]
                        ),

                        cargo=str(
                            row["Cargo"]
                        ),

                        grado_academico=str(
                            row["Mayor Grado Academico"]
                        ),

                        numero_empleado=str(
                            row["Número de Empleado"]
                        ),

                        unidades_minimas=str(
                            row["Unidades Minimas"]
                        )

                    )

                    documentos.append(
                        documento
                    )


                # GUARDADO MASIVO EN MONGODB

                if documentos:

                    Empleado.objects.insert(
                        documentos
                    )


                cantidad_registros = len(
                    documentos
                )


                return render(
                    request,
                    "empleados/empleados_upload_form.html",
                    {
                        "form": EmpleadoUploadForm(),
                        "carga_exitosa": True,
                        "cantidad_registros":
                            cantidad_registros
                    }
                )


            except ValueError:

                form.add_error(
                    "archivo",
                    "El archivo no contiene una pestaña llamada 'Usuarios'."
                )


    else:

        form = EmpleadoUploadForm()


    return render(
        request,
        "empleados/empleados_upload_form.html",
        {
            "form": form
        }
    )