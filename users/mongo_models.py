import mongoengine


class UserDocument(mongoengine.Document):

    email = mongoengine.EmailField(
        required=True,
        unique=True
    )

    role = mongoengine.StringField(
        required=True
    )

    nombre_completo = mongoengine.StringField(
        required=False
    )

    numero_empleado = mongoengine.StringField(
        required=False
    )

    numero_instructor = mongoengine.IntField(
        required=False
    )

    numero_cuenta = mongoengine.StringField(
        required=False
    )

    meta = {
        "collection": "users"
    }