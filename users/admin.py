from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    model = User

    list_display = (
        "email",
        "role",
        "is_staff",
        "is_active",
        "must_change_password",
    )

    list_filter = (
        "role",
        "is_staff",
        "is_active",
        "must_change_password",
    )

    search_fields = (
        "email",
    )

    ordering = (
        "email",
    )

    fieldsets = (
        (None, {
            "fields": (
                "email",
                "password",
            )
        }),
        ("Información del usuario", {
            "fields": (
                "role",
                "must_change_password",
                "first_name",
                "last_name",
            )
        }),
        ("Permisos", {
            "fields": (
                "is_active",
                "is_staff",
                "is_superuser",
                "groups",
                "user_permissions",
            )
        }),
        ("Fechas importantes", {
            "fields": (
                "last_login",
                "date_joined",
            )
        }),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                "email",
                "role",
                "password1",
                "password2",
                "must_change_password",
            ),
        }),
    )