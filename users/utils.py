import hashlib
import hmac

from django.conf import settings


def hash_password_change_code(codigo):

    return hmac.new(
        settings.PASSWORD_CHANGE_CODE_SECRET.encode(
            "utf-8"
        ),
        codigo.encode(
            "utf-8"
        ),
        hashlib.sha256
    ).hexdigest()