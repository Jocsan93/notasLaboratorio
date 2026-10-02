from django.contrib.auth.decorators import login_required
from django.shortcuts import render
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

    return render(
        request,
        "metricas/metricas.html"
    )