import re
from email.utils import formataddr

from django.conf import settings
from django.core.mail import EmailMessage, get_connection

from home.models import BaseSettings, ViewsChoices


def parse_recipient_list(value: str) -> list[str]:
    if not value:
        return []

    return [
        email.strip()
        for email in re.split(r"[,;]", value)
        if email.strip()
    ]


def get_email_config() -> dict:
    """
    Если SMTP включён в BaseSettings, используются
    настройки из базы.

    Если выключен или запись отсутствует, используются
    настройки из settings.py.
    """
    base_settings = BaseSettings.objects.first()

    use_database_smtp = (
        base_settings is not None
        and base_settings.smtp_enabled == ViewsChoices.YES
    )

    if use_database_smtp:
        from_email_address = (
            base_settings.smtp_from_email
            or base_settings.smtp_username
        )

        return {
            "host": base_settings.smtp_host,
            "port": base_settings.smtp_port,
            "username": base_settings.smtp_username,
            "password": base_settings.smtp_password,
            "use_ssl": (
                base_settings.smtp_use_ssl
                == ViewsChoices.YES
            ),
            "use_tls": (
                base_settings.smtp_use_tls
                == ViewsChoices.YES
            ),
            "timeout": base_settings.smtp_timeout,
            "from_email": formataddr((
                base_settings.smtp_from_name
                or "Заявки с сайта",
                from_email_address,
            )),
            "recipients": parse_recipient_list(
                base_settings.smtp_recipients
            ),
        }

    return {
        "host": settings.EMAIL_HOST,
        "port": settings.EMAIL_PORT,
        "username": settings.EMAIL_HOST_USER,
        "password": settings.EMAIL_HOST_PASSWORD,
        "use_ssl": settings.EMAIL_USE_SSL,
        "use_tls": settings.EMAIL_USE_TLS,
        "timeout": settings.EMAIL_TIMEOUT,
        "from_email": settings.DEFAULT_FROM_EMAIL,
        "recipients": parse_recipient_list(
            settings.EMAIL_RECIPIENT
        ),
    }


def validate_email_config(config: dict) -> None:
    required_fields = {
        "host": "Не указан SMTP-сервер.",
        "port": "Не указан SMTP-порт.",
        "username": "Не указан SMTP-логин.",
        "password": "Не указан SMTP-пароль.",
        "recipients": "Не указаны получатели писем.",
    }

    for field_name, error_message in required_fields.items():
        if not config.get(field_name):
            raise ValueError(error_message)

    if config["use_ssl"] and config["use_tls"]:
        raise ValueError(
            "SMTP SSL и TLS нельзя включать одновременно."
        )


def email_callback(
    message: str,
    title: str,
) -> int:
    config = get_email_config()

    validate_email_config(config)

    connection = get_connection(
        backend=(
            "django.core.mail.backends.smtp.EmailBackend"
        ),
        host=config["host"],
        port=config["port"],
        username=config["username"],
        password=config["password"],
        use_ssl=config["use_ssl"],
        use_tls=config["use_tls"],
        timeout=config["timeout"],
    )

    email = EmailMessage(
        subject=title,
        body=message,
        from_email=config["from_email"],
        to=config["recipients"],
        connection=connection,
    )

    return email.send(
        fail_silently=False,
    )