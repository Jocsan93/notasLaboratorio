from django import forms


class LabUploadForm(forms.Form):

    archivo = forms.FileField(
        label="Archivo de secciones",
        widget=forms.ClearableFileInput(
            attrs={
                "accept": ".xlsx,.xls"
            }
        )
    )