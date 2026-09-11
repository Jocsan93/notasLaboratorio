import pandas as pd
from django.contrib.auth.decorators import login_required, user_passes_test
from django.shortcuts import render
from .forms import TheoryUploadForm
from functools import wraps
from django.contrib.auth.views import redirect_to_login
from django.core.exceptions import PermissionDenied
from .models_django import TheoryStudent
from django.core.paginator import Paginator
from io import BytesIO
import openpyxl
from django.http import HttpResponse



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

    registros = TheoryStudent.objects.count()

    if registros > 0:

        return render(
            request,
            "theory/theory_upload_form.html",
            {
                "registros_existentes": True,
                "cantidad_registros": registros
            }
        )

    # Aquí continúa nuestro flujo normal de carga...

    if request.method == "POST":

        form = TheoryUploadForm(
            request.POST,
            request.FILES
        )

        if form.is_valid():

            archivo = form.cleaned_data["archivo"]

            try:
                # LEER TODAS LAS HOJAS DEL EXCEL
                excel = pd.read_excel(
                    archivo,
                    sheet_name=None
                )

                dataframes = []

                # PROCESAR CADA HOJA

                for nombre_hoja, df in excel.items():

                    # Agregar el tipo de física
                    # utilizando el nombre de la hoja
                    df["Fisica"] = nombre_hoja

                    # Eliminar columnas innecesarias
                    df = df.drop(
                        columns=[
                            "No",
                            "Por Egresar",
                            "Estado",
                            "Matricula"
                        ],
                        errors="ignore"
                    )

                    dataframes.append(df)
                # UNIR TODAS LAS HOJAS


                df_final = pd.concat(
                    dataframes,
                    ignore_index=True
                )


                # CREAR DOCUMENTOS MONGOENGINE


                documentos = []

                for _, row in df_final.iterrows():

                    documento = TheoryStudent(
                        control=int(row["Control"]),
                        cuenta=str(row["Cuenta"]),
                        nombre=str(row["Nombre"]),
                        matricula=str(row["Matrícula"]),
                        correo=str(row["Correo"]),
                        seccion=str(row["Sección"]),
                        profesor=str(row["Profesor"]),
                        fisica=str(row["Fisica"])
                    )

                    documentos.append(documento)


                # GUARDADO MASIVO EN MONGODB


                if documentos:

                    TheoryStudent.objects.insert(
                        documentos
                    )

                cantidad_registros = len(documentos)

                return render(
                                request,
                                "theory/theory_upload_form.html",
                                {
                                    "form": TheoryUploadForm(),
                                    "carga_exitosa": True,
                                    "cantidad_registros": cantidad_registros
                                }
                            )
            except Exception as e:

                print(
                    "Error al procesar el Excel:",
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

@login_required
@admin_required
def theory_sections_view(request):

    secciones = TheoryStudent.objects.only(
        "profesor",
        "seccion",
        "fisica"
    )

    secciones_unicas = {}

    for estudiante in secciones:

        clave = (
            estudiante.profesor,
            estudiante.seccion,
            estudiante.fisica
        )

        if clave not in secciones_unicas:

            secciones_unicas[clave] = {
                "profesor": estudiante.profesor,
                "seccion": estudiante.seccion,
                "fisica": estudiante.fisica,
                "matriculados": 0
            }

        secciones_unicas[clave]["matriculados"] += 1

    secciones_lista = list(
        secciones_unicas.values()
    )

    paginator = Paginator(
        secciones_lista,
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
        "theory/theory_sections_table.html",
        {
            "secciones": pagina,
            "paginator": paginator,
        }
    )

@login_required
@admin_required
def theory_section_students_view(request):

    profesor = request.GET.get("profesor")
    seccion = request.GET.get("seccion")
    fisica = request.GET.get("fisica")

    estudiantes = TheoryStudent.objects(
        profesor=profesor,
        seccion=seccion,
        fisica=fisica
    ).only(
        "nombre",
        "cuenta"
    )

    return render(
        request,
        "theory/theory_section_students.html",
        {
            "estudiantes": estudiantes,
            "profesor": profesor,
            "seccion": seccion,
            "fisica": fisica,
        }
    )

@login_required
@admin_required
def theory_section_students_excel_view(request):

    profesor = request.GET.get("profesor")
    seccion = request.GET.get("seccion")
    fisica = request.GET.get("fisica")

    estudiantes = TheoryStudent.objects(
        profesor=profesor,
        seccion=seccion,
        fisica=fisica
    ).only(
        "nombre",
        "cuenta"
    )

    workbook = openpyxl.Workbook()

    worksheet = workbook.active
    worksheet.title = "Estudiantes"

    worksheet.append([
        "Nombre completo",
        "Número de cuenta",
        "Nota final de laboratorio"
    ])

    for estudiante in estudiantes:

        worksheet.append([
            estudiante.nombre,
            estudiante.cuenta,
            0
        ])

    worksheet.column_dimensions["A"].width = 45
    worksheet.column_dimensions["B"].width = 22
    worksheet.column_dimensions["C"].width = 28

    output = BytesIO()

    workbook.save(output)

    output.seek(0)

    response = HttpResponse(
        output.getvalue(),
        content_type=(
            "application/vnd.openxmlformats-officedocument."
            "spreadsheetml.sheet"
        )
    )

    nombre_archivo = (
        f"{fisica}_seccion_{seccion}.xlsx"
    )

    response["Content-Disposition"] = (
        f'attachment; filename="{nombre_archivo}"'
    )

    return response


@login_required
@admin_required
def theory_search_view(request):

    profesor = request.GET.get(
        "profesor",
        ""
    ).strip()

    if not profesor:
        return render(
            request,
            "theory/theory_search_table.html",
            {
                "secciones": []
            }
        )

    estudiantes = TheoryStudent.objects(
        profesor__icontains=profesor
    ).only(
        "profesor",
        "seccion",
        "fisica"
    )

    secciones_unicas = {}

    for estudiante in estudiantes:

        clave = (
            estudiante.profesor,
            estudiante.seccion,
            estudiante.fisica
        )

        if clave not in secciones_unicas:

            secciones_unicas[clave] = {
                "profesor": estudiante.profesor,
                "seccion": estudiante.seccion,
                "fisica": estudiante.fisica,
                "matriculados": 0
            }

        secciones_unicas[clave]["matriculados"] += 1

    secciones_lista = list(
        secciones_unicas.values()
    )

    secciones_lista = secciones_lista[:15]

    return render(
        request,
        "theory/theory_search_results.html",
        {
            "secciones": secciones_lista
        }
    )