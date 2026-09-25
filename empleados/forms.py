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