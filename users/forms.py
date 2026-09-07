from django import forms


def validate_unah_email(email):

    email = email.lower()

    if not (
        email.endswith("@unah.hn")
        or email.endswith("@unah.edu.hn")
    ):
        raise forms.ValidationError(
            "Debe utilizar un correo institucional."
        )

    return email


class AdminRegistrationForm(forms.Form):

    email = forms.EmailField(
        label="Correo institucional",
        validators=[validate_unah_email]
    )

    password = forms.CharField(
        label="Contraseña",
        min_length=8,
        widget=forms.PasswordInput
    )

    confirm_password = forms.CharField(
        label="Confirmar contraseña",
        widget=forms.PasswordInput
    )
    
    def clean(self):

        cleaned_data = super().clean()

        password = cleaned_data.get("password")
        confirm = cleaned_data.get("confirm_password")

        if password and confirm and password != confirm:

            self.add_error(
                "confirm_password",
                "Las contraseñas no coinciden."
            )

        return cleaned_data


class InstructorRegistrationForm(forms.Form):

    email = forms.EmailField(
        label="Correo institucional",
        validators=[validate_unah_email]
    )

    nombre_completo = forms.CharField(
        label="Nombre completo",
        max_length=150
    )


    password = forms.CharField(
        label="Contraseña",
        min_length=8,
        widget=forms.PasswordInput
    )

    confirm_password = forms.CharField(
        label="Confirmar contraseña",
        widget=forms.PasswordInput
    )

    def clean(self):

        cleaned_data = super().clean()

        password = cleaned_data.get("password")
        confirm = cleaned_data.get("confirm_password")

        if password and confirm and password != confirm:

            self.add_error(
                "confirm_password",
                "Las contraseñas no coinciden."
            )

        return cleaned_data


class ProfessorRegistrationForm(forms.Form):

    email = forms.EmailField(
        label="Correo institucional",
        validators=[validate_unah_email]
    )

    nombre_completo = forms.CharField(
        label="Nombre completo",
        max_length=150
    )

    numero_empleado = forms.CharField(
        label="Número de empleado",
        max_length=30
    )

    password = forms.CharField(
        label="Contraseña",
        min_length=8,
        widget=forms.PasswordInput
    )

    confirm_password = forms.CharField(
        label="Confirmar contraseña",
        widget=forms.PasswordInput
    )

    def clean(self):

        cleaned_data = super().clean()

        password = cleaned_data.get("password")
        confirm = cleaned_data.get("confirm_password")

        if password and confirm and password != confirm:

            self.add_error(
                "confirm_password",
                "Las contraseñas no coinciden."
            )

        return cleaned_data


class StudentRegistrationForm(forms.Form):

    email = forms.EmailField(
        label="Correo institucional",
        validators=[validate_unah_email]
    )

    nombre_completo = forms.CharField(
        label="Nombre completo",
        max_length=150
    )

    numero_cuenta = forms.CharField(
        label="Número de cuenta",
        max_length=30
    )

    password = forms.CharField(
        label="Contraseña",
        min_length=8,
        widget=forms.PasswordInput
    )

    confirm_password = forms.CharField(
        label="Confirmar contraseña",
        widget=forms.PasswordInput
    )

    def clean(self):

        cleaned_data = super().clean()

        password = cleaned_data.get("password")
        confirm = cleaned_data.get("confirm_password")

        if password and confirm and password != confirm:

            self.add_error(
                "confirm_password",
                "Las contraseñas no coinciden."
            )

        return cleaned_data