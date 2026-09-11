from mongoengine import Document, IntField, StringField, EmailField

class TheoryStudent(Document):

    control = IntField()

    cuenta = StringField(
        max_length=20
    )

    nombre = StringField(
        max_length=150
    )

    matricula = StringField(
        max_length=20
    )

    correo = EmailField(
        max_length=150
    )

    seccion = StringField(
        max_length=20
    )

    profesor = StringField(
        max_length=150
    )

    fisica = StringField(
        max_length=20
    )

    meta = {
        "collection": "theory_students"
    }

    def __str__(self):
        return f"{self.cuenta} - {self.nombre}"