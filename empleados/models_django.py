from mongoengine import (
    Document,
    IntField,
    StringField
)


class Empleado(Document):

    departamento = StringField(
        max_length=150
    )

    nombre = StringField(
        max_length=150
    )

    correo = StringField(
        max_length=150
    )

    genero = StringField(
        max_length=30
    )

    identidad = StringField(
        max_length=30
    )

    contrato = StringField(
        max_length=100
    )

    ingreso = StringField(
        max_length=30
    )

    cumpleanos = StringField(
        max_length=30
    )

    telefono = StringField(
        max_length=30
    )

    cargo = StringField(
        max_length=150
    )

    grado_academico = StringField(
        max_length=150
    )

    numero_empleado = StringField(
        max_length=30
    )

    unidades_minimas = StringField(
        max_length=30
    )


    meta = {
        "collection": "empleados"
    }


    def __str__(self):

        return f"{self.numero_empleado} - {self.nombre}"