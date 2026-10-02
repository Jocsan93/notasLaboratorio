from django import forms


class EmpleadoUploadForm(forms.Form):

    archivo = forms.FileField(
        label="Archivo de empleados",
        widget=forms.ClearableFileInput(
            attrs={
                "accept": ".xlsx,.xls"
            }
        )
    )

    def clean_archivo(self):

        archivo = self.cleaned_data["archivo"]

        nombre = archivo.name.lower()

        if not (
            nombre.endswith(".xlsx")
            or nombre.endswith(".xls")
        ):

            raise forms.ValidationError(
                "El archivo debe ser un Excel (.xlsx o .xls)."
            )

        return archivo


class EmpleadoUpdateForm(forms.Form):

    departamento = forms.ChoiceField(
        label="Departamento",
        choices=[
            (
                "Materia Condensada",
                "Materia Condensada"
            ),
            (
                "Altas Energías",
                "Altas Energías"
            ),
            (
                "Física de la Tierra",
                "Física de la Tierra"
            )
        ],
        required=False,
        widget=forms.Select(
            attrs={
                "class": "form-select"
            }
        )
    )

    nombre = forms.CharField(
        label="Nombre completo",
        max_length=150,
        required=False,
        widget=forms.TextInput(
            attrs={
                "class": "form-control"
            }
        )
    )

    correo = forms.EmailField(
        label="Correo",
        max_length=150,
        required=False,
        widget=forms.EmailInput(
            attrs={
                "class": "form-control"
            }
        )
    )

    genero = forms.ChoiceField(
        label="Género",
        choices=[
            ("M", "M"),
            ("F", "F"),
            ("NA", "NA")
        ],
        required=False,
        widget=forms.Select(
            attrs={
                "class": "form-select"
            }
        )
    )

    identidad = forms.CharField(
        label="Número de identidad",
        max_length=30,
        required=False,
        widget=forms.TextInput(
            attrs={
                "class": "form-control"
            }
        )
    )

    contrato = forms.CharField(
        label="Contrato",
        max_length=100,
        required=False,
        widget=forms.TextInput(
            attrs={
                "class": "form-control"
            }
        )
    )

    ingreso = forms.DateField(
        label="Fecha de ingreso",
        required=False,
        widget=forms.DateInput(
            attrs={
                "type": "date",
                "class": "form-control"
            }
        )
    )

    cumpleanos = forms.DateField(
        label="Cumpleaños",
        required=False,
        widget=forms.DateInput(
            attrs={
                "type": "date",
                "class": "form-control"
            }
        )
    )

    telefono = forms.CharField(
        label="Teléfono",
        max_length=30,
        required=False,
        widget=forms.TextInput(
            attrs={
                "type": "tel",
                "class": "form-control"
            }
        )
    )

    cargo = forms.CharField(
        label="Cargo",
        max_length=150,
        required=False,
        widget=forms.TextInput(
            attrs={
                "class": "form-control"
            }
        )
    )

    grado_academico = forms.CharField(
        label="Grado académico",
        max_length=150,
        required=False,
        widget=forms.TextInput(
            attrs={
                "class": "form-control"
            }
        )
    )

    numero_empleado = forms.CharField(
        label="Número de empleado",
        max_length=30,
        required=False,
        widget=forms.TextInput(
            attrs={
                "class": "form-control"
            }
        )
    )

    unidades_minimas = forms.CharField(
        label="Unidades mínimas",
        max_length=30,
        required=False,
        widget=forms.TextInput(
            attrs={
                "class": "form-control"
            }
        )
    )