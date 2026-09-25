import pandas as pd
from django.contrib.auth.decorators import login_required
from .models_django import LabStudent
from theory.models_django import TheoryStudent
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

    registros = LabStudent.objects.count()

    if registros > 0:

        return render(
            request,
            "lab/lab_upload_form.html",
            {
                "registros_existentes": True,
                "cantidad_registros": registros
            }
        )

    if request.method == "POST":

        form = LabUploadForm(
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
                    df["fisica"]= nombre_hoja    
                    df = df.drop(
                        columns=[
                            "No"
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

                    documento = LabStudent(
                        control=int(row["Control"]),
                        cuenta=str(row["Cuenta"]),
                        nombre=str(row["Nombre"]),
                        carrera=str(row["Carrera"]),
                        dia=str(row["Día"]),
                        hora=int(row["Hora"]),
                        fisica= str(row["fisica"])
                    )

                    documentos.append(documento)


                # GUARDADO MASIVO EN MONGODB

                if documentos:

                    LabStudent.objects.insert(
                        documentos
                    )


                cantidad_registros = len(
                    documentos
                )


                return render(
                    request,
                    "lab/lab_upload_form.html",
                    {
                        "form": LabUploadForm(),
                        "carga_exitosa": True,
                        "cantidad_registros":
                            cantidad_registros
                    }
                )


            except Exception as e:

                print(
                    "Error al procesar el Excel:",
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

@login_required
@admin_required
def lab_sections_view(request):

    secciones = LabStudent.objects.only(
        "fisica",
        "dia",
        "hora",
        "instructor"
    )

    secciones_unicas = {}

    for estudiante in secciones:

        clave = (
            estudiante.fisica,
            estudiante.dia,
            estudiante.hora
        )

        if clave not in secciones_unicas:

            secciones_unicas[clave] = {
                "fisica": estudiante.fisica,
                "dia": estudiante.dia,
                "hora": estudiante.hora,
                "instructor": estudiante.instructor,
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
        "lab/lab_sections_table.html",
        {
            "secciones": pagina,
            "paginator": paginator,
        }
    )

@login_required
@admin_required
def lab_section_students_view(request):

    fisica = request.GET.get("fisica")
    dia = request.GET.get("dia")
    hora = request.GET.get("hora")

    estudiantes = LabStudent.objects(
        fisica=fisica,
        dia=dia,
        hora=hora
    ).only(
        "nombre",
        "cuenta",
        "carrera",
        "instructor"
    )

    instructor = estudiantes.first().instructor

    return render(
        request,
        "lab/lab_section_students.html",
        {
            "estudiantes": estudiantes,
            "fisica": fisica,
            "dia": dia,
            "hora": hora,
            "instructor": instructor,
        }
    )

@login_required
@admin_required
def lab_section_students_excel_view(request):

    fisica = request.GET.get("fisica")
    dia = request.GET.get("dia")
    hora = request.GET.get("hora")

    estudiantes = LabStudent.objects(
        fisica=fisica,
        dia=dia,
        hora=hora
    ).only(
        "nombre",
        "cuenta",
        "carrera",
        "instructor"
    )

    workbook = openpyxl.Workbook()

    worksheet = workbook.active
    worksheet.title = "Estudiantes"

    worksheet.append([
        "Nombre completo",
        "Número de cuenta",
        "Carrera",
        "Instructor",
        "Nota final de laboratorio"
    ])

    for estudiante in estudiantes:

        worksheet.append([
            estudiante.nombre,
            estudiante.cuenta,
            estudiante.carrera,
            estudiante.instructor,
            0
        ])

    worksheet.column_dimensions["A"].width = 45
    worksheet.column_dimensions["B"].width = 22
    worksheet.column_dimensions["C"].width = 35
    worksheet.column_dimensions["D"].width = 30
    worksheet.column_dimensions["E"].width = 28

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
        f"{fisica}_{dia}_{hora}.xlsx"
    )

    response["Content-Disposition"] = (
        f'attachment; filename="{nombre_archivo}"'
    )

    return response

@login_required
@admin_required
def lab_search_sections_view(request):

    instructor = request.GET.get(
        "instructor",
        ""
    ).strip()

    if not instructor:
        return render(
            request,
            "lab/lab_search.html",
            {
                "secciones": []
            }
        )

    estudiantes = LabStudent.objects(
        instructor__icontains=instructor
    ).only(
        "fisica",
        "dia",
        "hora",
        "instructor"
    )

    secciones_unicas = {}

    for estudiante in estudiantes:

        clave = (
            estudiante.fisica,
            estudiante.dia,
            estudiante.hora
        )

        if clave not in secciones_unicas:

            secciones_unicas[clave] = {
                "fisica": estudiante.fisica,
                "dia": estudiante.dia,
                "hora": estudiante.hora,
                "instructor": estudiante.instructor,
                "matriculados": 0
            }

        secciones_unicas[
            clave
        ]["matriculados"] += 1

    secciones_lista = list(
        secciones_unicas.values()
    )

    secciones_lista = secciones_lista[:15]

    return render(
        request,
        "lab/lab_search_results.html",
        {
            "secciones": secciones_lista
        }
    )

@login_required
@admin_required
def lab_delete_view(request):

    if request.method == "POST":

        cantidad_eliminada = LabStudent.objects.count()

        LabStudent.objects.delete()

        return JsonResponse({
            "success": True,
            "cantidad_eliminada": cantidad_eliminada
        })

    return render(
        request,
        "lab/lab_delete.html",
        {}
    )

@login_required
@admin_required
def lab_cleanup_view(request):

    if request.method == "POST":

        cuenta = request.POST.get(
            "cuenta"
        )

        estudiante = TheoryStudent.objects(
            cuenta=cuenta
        ).first()

        if estudiante:

            estudiante.delete()

            return JsonResponse({
                "success": True,
                "cuenta": cuenta
            })

        return JsonResponse({
            "success": False,
            "error": "No se encontró el estudiante."
        })


    estudiantes_teoria = TheoryStudent.objects.only(
        "cuenta",
        "nombre",
        "correo",
        "seccion",
        "fisica"
    )

    cuentas_lab = set(
        LabStudent.objects.only(
            "cuenta"
        ).scalar(
            "cuenta"
        )
    )

    estudiantes_faltantes = []

    for estudiante in estudiantes_teoria:

        if estudiante.cuenta not in cuentas_lab:

            estudiantes_faltantes.append(
                {
                    "cuenta": estudiante.cuenta,
                    "nombre": estudiante.nombre,
                    "correo": estudiante.correo,
                    "seccion": estudiante.seccion,
                    "fisica": estudiante.fisica,
                }
            )


    return render(
        request,
        "lab/lab_cleanup.html",
        {
            "estudiantes": estudiantes_faltantes,
            "total_teoria": estudiantes_teoria.count(),
            "total_lab": LabStudent.objects.count(),
            "total_faltantes": len(
                estudiantes_faltantes
            ),
        }
    )