from mongoengine import Document, IntField, StringField

class LabStudent(Document):

    control = IntField()

    cuenta = StringField(
        max_length=20
    )

    nombre = StringField(
        max_length=150
    )

    carrera = StringField(
        max_length=150
    )

    dia = StringField(
        max_length=30
    )

    hora = IntField()

    fisica = StringField(max_length=10)

    instructor = StringField(
        max_length=150, 
        default= "SIN ASIGNAR"
        )

    meta = {
        "collection": "lab_students"
    }

    def __str__(self):
        return f"{self.cuenta} - {self.nombre}"