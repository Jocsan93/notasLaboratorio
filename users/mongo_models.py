import mongoengine
from django.utils import timezone


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


class PasswordChangeCode(mongoengine.Document):

    email = mongoengine.EmailField(
        required=True
    )

    codigo_hash = mongoengine.StringField(
        required=True
    )

    creado_en = mongoengine.DateTimeField(
        required=True,
        default=timezone.now
    )

    meta = {
        "collection": "password_change_codes",
        "indexes": [
            {
                "fields": ["creado_en"],
                "expireAfterSeconds": 900
            }
        ]
    }