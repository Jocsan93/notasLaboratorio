from django.contrib.auth import authenticate, login, logout, get_user_model
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from users.models import User
from django.core.exceptions import PermissionDenied
from .forms import AdminRegistrationForm, InstructorRegistrationForm, ProfessorRegistrationForm, StudentRegistrationForm
from .mongo_models import UserDocument
from functools import wraps
from django.contrib.auth.views import redirect_to_login



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

def loginView(request):
    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")
        user = authenticate(
            request,
            email=email,
            password=password
        )
        if user is not None:
            login(request, user)
            return redirect("")
        else:
            return render(
                request,
                "users/login.html",
                {
                    "error": "Correo o contraseña incorrectos."
                }
            )
    return render(request, "users/login.html")

def logoutView(request):
    logout(request)
    return redirect("")

@login_required
def profileView(request):

    role = request.user.role

    if role == request.user.Roles.ADMINISTRADOR:
        return redirect("perfil_admin")

    elif role == request.user.Roles.COORDINADOR:
        return redirect("perfil_coordinador")

    elif role == request.user.Roles.PROFESOR:
        return redirect("perfil_profesor")

    elif role == request.user.Roles.INSTRUCTOR:
        return redirect("perfil_instructor")

    elif role == request.user.Roles.ESTUDIANTE:
        return redirect("perfil_estudiante")

    return redirect("")

@login_required 
@admin_required
def perfilAdminView(request): 
    if request.user.role != User.Roles.ADMINISTRADOR: 
        raise PermissionDenied 
    return render(request, "users/perfil_admin.html")

@login_required
@admin_required
def adminRegisterView(request):
    if request.user.role != User.Roles.ADMINISTRADOR:
        raise PermissionDenied
    return render(request, "users/registro_admin.html")

@login_required
@admin_required
def admin_registration_form(request):

    User = get_user_model()

    if request.method == "POST":

        form = AdminRegistrationForm(request.POST)

        if form.is_valid():

            email = form.cleaned_data["email"]
            password = form.cleaned_data["password"]

            # Verificar que el usuario no exista en Django
            if User.objects.filter(email=email).exists():

                form.add_error(
                    "email",
                    "Ya existe un usuario registrado con este correo."
                )

            else:

                # Crear usuario en SQLite
                user = User(
                    email=email,
                    role=User.Roles.ADMINISTRADOR,
                    must_change_password=True
                )

                user.set_password(password)
                user.save()

                # Crear usuario en MongoDB
                UserDocument.objects.create(
                    email=email,
                    role="ADMIN"
                )

                # Limpiar formulario
                form = AdminRegistrationForm()

                return render(
                    request,
                    "users/admin_form.html",
                    {
                        "form": form,
                        "success": True
                    }
                )

    else:

        form = AdminRegistrationForm()

    return render(
        request,
        "users/admin_form.html",
        {
            "form": form
        }
    )


def get_next_instructor_number():
    ultimo_instructor = (
        UserDocument.objects
        .filter(role="INSTRUCTOR")
        .order_by("-numero_instructor")
        .first()
    )
    if ultimo_instructor is None:
        return 1

    return ultimo_instructor.numero_instructor + 1

@login_required
@admin_required
def instructor_registration_form(request):

    User = get_user_model()

    if request.method == "POST":

        form = InstructorRegistrationForm(request.POST)
        print(form.is_valid())
        if form.is_valid():

            email = form.cleaned_data["email"]
            password = form.cleaned_data["password"]
            nombre_completo = form.cleaned_data["nombre_completo"]


            # Verificar que el usuario no exista en Django
            if User.objects.filter(email=email).exists():
                form.add_error(
                    "email",
                    "Ya existe un usuario registrado con este correo."
                )

            else:

                # Obtener nuevamente el número disponible
                numero_instructor = get_next_instructor_number()

                # Crear usuario en SQLite
                user = User(
                    email=email,
                    role=User.Roles.INSTRUCTOR,
                    must_change_password=True
                )

                user.set_password(password)
                user.save()

                # Crear usuario en MongoDB
                UserDocument.objects.create(
                    email=email,
                    role="INSTRUCTOR",
                    nombre_completo=nombre_completo,
                    numero_instructor=numero_instructor
                )

                # Limpiar formulario
                form = InstructorRegistrationForm()

                return render(
                    request,
                    "users/instructor_form.html",
                    {
                        "form": form,
                        "success": True,
                        "numero_instructor": numero_instructor
                    }
                )

    else:

        form = InstructorRegistrationForm()

    # Mostrar el próximo número disponible
    numero_instructor = get_next_instructor_number()

    return render(
        request,
        "users/instructor_form.html",
        {
            "form": form,
            "numero_instructor": numero_instructor
        }
    )

@login_required
@admin_required
def professor_registration_form(request):

    User = get_user_model()

    if request.method == "POST":

        form = ProfessorRegistrationForm(request.POST)

        if form.is_valid():

            email = form.cleaned_data["email"]
            password = form.cleaned_data["password"]
            nombre_completo = form.cleaned_data["nombre_completo"]
            numero_empleado = form.cleaned_data["numero_empleado"]

            # Verificar que el usuario no exista en Django
            if User.objects.filter(email=email).exists():

                form.add_error(
                    "email",
                    "Ya existe un usuario registrado con este correo."
                )

            else:

                # Crear usuario en SQLite
                user = User(
                    email=email,
                    role=User.Roles.PROFESOR,
                    must_change_password=True
                )

                user.set_password(password)
                user.save()

                # Crear profesor en MongoDB
                UserDocument.objects.create(
                    email=email,
                    role="PROFESOR",
                    nombre_completo=nombre_completo,
                    numero_empleado=numero_empleado
                )

                # Limpiar formulario
                form = ProfessorRegistrationForm()

                return render(
                    request,
                    "users/professor_form.html",
                    {
                        "form": form,
                        "success": True
                    }
                )

    else:

        form = ProfessorRegistrationForm()

    return render(
        request,
        "users/professor_form.html",
        {
            "form": form
        }
    )

@login_required
@admin_required
def student_registration_form(request):

    User = get_user_model()

    if request.method == "POST":

        form = StudentRegistrationForm(request.POST)

        if form.is_valid():

            email = form.cleaned_data["email"]
            password = form.cleaned_data["password"]
            nombre_completo = form.cleaned_data["nombre_completo"]
            numero_cuenta = form.cleaned_data["numero_cuenta"]

            # Verificar que el usuario no exista en Django
            if User.objects.filter(email=email).exists():

                form.add_error(
                    "email",
                    "Ya existe un usuario registrado con este correo."
                )

            else:

                # Crear usuario en SQLite
                user = User(
                    email=email,
                    role=User.Roles.ESTUDIANTE,
                    must_change_password=True
                )

                user.set_password(password)
                user.save()

                # Crear estudiante en MongoDB
                UserDocument.objects.create(
                    email=email,
                    role="ESTUDIANTE",
                    nombre_completo=nombre_completo,
                    numero_cuenta=numero_cuenta
                )

                # Limpiar formulario
                form = StudentRegistrationForm()

                return render(
                    request,
                    "users/student_form.html",
                    {
                        "form": form,
                        "success": True
                    }
                )

    else:

        form = StudentRegistrationForm()

    return render(
        request,
        "users/student_form.html",
        {
            "form": form
        }
    )