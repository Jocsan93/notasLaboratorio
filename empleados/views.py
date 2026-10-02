import pandas as pd
from django.contrib.auth.decorators import login_required
from .models_django import Empleado
from django.shortcuts import render
from functools import wraps
from django.contrib.auth.views import redirect_to_login
from django.core.exceptions import PermissionDenied
from .forms import EmpleadoUploadForm, EmpleadoUpdateForm
from django.core.paginator import Paginator
from django.http import JsonResponse

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


@login_required
@admin_required
def empleados_delete_all_view(request):

    if request.method != "POST":

        return JsonResponse(
            {
                "success": False,
                "message": "Método no permitido."
            },
            status=405
        )


    cantidad_registros = Empleado.objects.count()


    if cantidad_registros == 0:

        return JsonResponse(
            {
                "success": False,
                "message": "No existen empleados para eliminar."
            },
            status=400
        )


    Empleado.objects.delete()


    return JsonResponse(
        {
            "success": True,
            "cantidad_eliminada": cantidad_registros,
            "message": (
                "Todos los empleados fueron "
                "eliminados correctamente."
            )
        }
    )    


@login_required
@admin_required
def empleados_list_view(request):

    empleados = Empleado.objects.only(
        "numero_empleado",
        "nombre",
        "correo",
        "cargo",
        "departamento"
    )

    paginator = Paginator(
        empleados,
        15
    )

    numero_pagina = request.GET.get(
        "page",
        1
    )

    pagina = paginator.get_page(
        numero_pagina
    )

    return render(
        request,
        "empleados/empleados_list_table.html",
        {
            "empleados": pagina,
            "paginator": paginator,
        }
    )


@login_required
@admin_required
def empleados_detail_view(request):

    numero_empleado = request.GET.get(
        "numero_empleado"
    )

    nombre = request.GET.get(
        "nombre"
    )

    empleado = None

    if numero_empleado:

        numero_empleado_limpio = (
            numero_empleado.strip().lower()
        )

        if numero_empleado_limpio != "nan":

            empleado = Empleado.objects(
                numero_empleado=numero_empleado
            ).first()

    if not empleado and nombre:

        empleado = Empleado.objects(
            nombre=nombre
        ).first()

    if not empleado:
        return JsonResponse(
            {
                "success": False,
                "message": (
                    "No se encontró el empleado."
                )
            },
            status=404
        )

    numero_empleado_mostrado = (
        empleado.numero_empleado
    )

    if numero_empleado_mostrado:

        numero_empleado_mostrado = (
            str(numero_empleado_mostrado).strip()
        )

        if numero_empleado_mostrado.endswith(".0"):

            numero_empleado_mostrado = (
                numero_empleado_mostrado[:-2]
            )

    return render(
        request,
        "empleados/empleado_detail_card.html",
        {
            "empleado": empleado,
            "numero_empleado_mostrado":
                numero_empleado_mostrado
        }
    )


@login_required
@admin_required
def empleados_update_view(request):

    numero_empleado = request.GET.get(
        "numero_empleado"
    )

    nombre = request.GET.get(
        "nombre"
    )

    empleado = None

    if numero_empleado:

        numero_empleado_limpio = (
            numero_empleado.strip().lower()
        )

        if numero_empleado_limpio != "nan":

            empleado = Empleado.objects(
                numero_empleado=numero_empleado
            ).first()

    if not empleado and nombre:

        empleado = Empleado.objects(
            nombre=nombre
        ).first()

    if not empleado:

        return JsonResponse(
            {
                "success": False,
                "message": (
                    "No se encontró el empleado."
                )
            },
            status=404
        )

    if request.method == "POST":

        form = EmpleadoUpdateForm(
            request.POST
        )

        if form.is_valid():

            datos = form.cleaned_data

            empleado.departamento = (
                datos["departamento"]
            )

            empleado.nombre = (
                datos["nombre"]
            )

            empleado.correo = (
                datos["correo"]
            )

            empleado.genero = (
                datos["genero"]
            )

            empleado.identidad = (
                datos["identidad"]
            )

            empleado.contrato = (
                datos["contrato"]
            )

            empleado.ingreso = (
                datos["ingreso"].strftime("%Y-%m-%d")
                if datos["ingreso"]
                else ""
            )

            empleado.cumpleanos = (
                datos["cumpleanos"].strftime("%Y-%m-%d")
                if datos["cumpleanos"]
                else ""
            )

            empleado.telefono = (
                datos["telefono"]
            )

            empleado.cargo = (
                datos["cargo"]
            )

            empleado.grado_academico = (
                datos["grado_academico"]
            )

            empleado.numero_empleado = (
                datos["numero_empleado"]
            )

            empleado.unidades_minimas = (
                datos["unidades_minimas"]
            )

            empleado.save()

            return JsonResponse(
                {
                    "success": True,
                    "message": (
                        "La información del empleado "
                        "se actualizó correctamente."
                    )
                }
            )

    else:

        ingreso = empleado.ingreso

        if ingreso:

            ingreso = str(
                ingreso
            )[:10]

        cumpleanos = empleado.cumpleanos

        if cumpleanos:

            cumpleanos = str(
                cumpleanos
            )[:10]

        form = EmpleadoUpdateForm(
            initial={
                "departamento":
                    empleado.departamento,

                "nombre":
                    empleado.nombre,

                "correo":
                    empleado.correo,

                "genero":
                    empleado.genero,

                "identidad":
                    empleado.identidad,

                "contrato":
                    empleado.contrato,

                "ingreso":
                    ingreso,

                "cumpleanos":
                    cumpleanos,

                "telefono":
                    empleado.telefono,

                "cargo":
                    empleado.cargo,

                "grado_academico":
                    empleado.grado_academico,

                "numero_empleado":
                    empleado.numero_empleado,

                "unidades_minimas":
                    empleado.unidades_minimas
            }
        )

    return render(
        request,
        "empleados/empleado_update_form.html",
        {
            "form": form,
            "empleado": empleado
        }
    )


@login_required
@admin_required
def empleados_search_view(request):



    nombre = request.GET.get(
        "nombre",
        ""
    ).strip()



    if not nombre:


        return render(
            request,
            "empleados/empleados_search.html",
            {
                "empleados": []
            }
        )


    empleados = Empleado.objects(
        nombre__icontains=nombre
    ).only(
        "numero_empleado",
        "nombre",
        "correo",
        "cargo",
        "departamento"
    )


    empleados = empleados[:15]





    return render(
        request,
        "empleados/empleados_search_results.html",
        {
            "empleados": empleados
        }
    )