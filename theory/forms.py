from django import forms

class TheoryUploadForm(forms.Form):

    archivo = forms.FileField(
        label="Archivo de secciones",
        widget=forms.ClearableFileInput(
            attrs={
                "accept": ".xlsx,.xls"
            }
        )
    )