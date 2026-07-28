from django.db import models
from django.urls import reverse
from admin.singleton_model import SingletonModel
from django_quill.fields import QuillField
from django.core.exceptions import ValidationError

class StatusChoices(models.TextChoices):
  PUBLISHED = "published", "Опубликовано"
  DRAFT = "draft", "Черновик"

class ViewsChoices(models.TextChoices):
  YES = "yes", "Да"
  NO = "no", "Нет"

class BaseSettings(SingletonModel):
  STATUS_CHOICES = [
    ('published', 'Показывать'),
    ('draft', 'Не показывать'),
  ]

  logo = models.FileField(upload_to="base-settings/", blank=True, null=True, verbose_name="Логотип")
  logo_dark = models.ImageField(upload_to="base-settings/", blank=True, null=True, verbose_name="Логотип Footer")
  logo_width = models.CharField(max_length=250, blank=True, null=True, db_index=True, verbose_name="Ширина логотипа")
  logo_height = models.CharField(max_length=250, blank=True, null=True, db_index=True, verbose_name="Высота логотипа")
  email = models.EmailField(max_length=250, blank=True, null=True, db_index=True, verbose_name="Email")
  address = models.CharField(max_length=250, blank=True, null=True, verbose_name="Адрес")
  favicon = models.FileField(upload_to='base-settings/', blank=True, null=True, verbose_name="ФавИконка")
  inn = models.CharField(max_length=50, blank=True, null=True, verbose_name="ИНН")
  copyright = models.CharField(max_length=250, blank=True, null=True, verbose_name="Копирайт")
  map = models.TextField(null=True, blank=True, verbose_name="Код карты")
  smtp_enabled = models.CharField(
      max_length=3,
      choices=ViewsChoices.choices,
      default=ViewsChoices.NO,
      verbose_name="Использовать SMTP из админки",
  )
  smtp_host = models.CharField(
      max_length=255,
      default="smtp.mail.ru",
      blank=True,
      verbose_name="SMTP-сервер",
  )
  smtp_port = models.PositiveIntegerField(
      default=465,
      verbose_name="SMTP-порт",
  )
  smtp_username = models.EmailField(
      max_length=255,
      blank=True,
      verbose_name="SMTP-логин",
      help_text="Полный адрес почтового ящика",
  )
  smtp_password = models.CharField(
      max_length=255,
      blank=True,
      verbose_name="SMTP-пароль",
      help_text="Для Mail.ru используется пароль внешнего приложения",
  )
  smtp_use_ssl = models.CharField(
      max_length=3,
      choices=ViewsChoices.choices,
      default=ViewsChoices.YES,
      verbose_name="Использовать SSL",
  )
  smtp_use_tls = models.CharField(
      max_length=3,
      choices=ViewsChoices.choices,
      default=ViewsChoices.NO,
      verbose_name="Использовать TLS",
  )
  smtp_timeout = models.PositiveIntegerField(
      default=20,
      verbose_name="Таймаут подключения",
  )
  smtp_from_name = models.CharField(
      max_length=255,
      blank=True,
      default="Заявки с сайта",
      verbose_name="Имя отправителя",
  )
  smtp_from_email = models.EmailField(
      max_length=255,
      blank=True,
      verbose_name="Email отправителя",
      help_text="Если пусто, будет использован SMTP-логин",
  )
  smtp_recipients = models.CharField(
      max_length=255,
      blank=True,

      verbose_name="Получатели заявок",
      help_text="Несколько адресов можно указать через запятую или точку с запятой",
  )

  def clean(self):
    super().clean()

    smtp_enabled = (
        self.smtp_enabled == ViewsChoices.YES
    )
    use_ssl = (
        self.smtp_use_ssl == ViewsChoices.YES
    )
    use_tls = (
        self.smtp_use_tls == ViewsChoices.YES
    )

    if use_ssl and use_tls:
      raise ValidationError({
        "smtp_use_tls": (
          "SSL и TLS нельзя включать одновременно."
        ),
      })

    if not smtp_enabled:
        return

    errors = {}

    required_fields = {
        "smtp_host": self.smtp_host,
        "smtp_port": self.smtp_port,
        "smtp_username": self.smtp_username,
        "smtp_password": self.smtp_password,
        "smtp_recipients": self.smtp_recipients,
    }

    for field_name, value in required_fields.items():
        if not value:
            errors[field_name] = (
                "Поле обязательно при включённом SMTP."
            )

    if errors:
        raise ValidationError(errors)

  def __str__(self):
    return "Основные настройки"


class HomeTemplate(SingletonModel):
  meta_h1 = models.CharField(max_length=250, blank=True, null=True, verbose_name="Заголовок первого уровня")
  subtitle = QuillField(blank=True, null=True, verbose_name="Подзаголовок")
  image = models.FileField(upload_to="home-page/", blank=True, null=True, verbose_name="Подложка")
  meta_title = models.CharField(max_length=350, null=True, blank=True, verbose_name="Мета заголовок")
  meta_description = models.TextField(null=True, blank=True, verbose_name="Meta описание")
  meta_keywords = models.CharField(max_length=350, null=True, blank=True, verbose_name="Meta keywords")
  left_text = QuillField(blank=True, null=True, verbose_name="Нижний текст левая колонка")
  right_text = QuillField(blank=True, null=True, verbose_name="Нижний текст правая колонка")

class Reviews(SingletonModel):
  meta_h1 = models.CharField(max_length=250, blank=True, null=True, verbose_name="Заголовок первого уровня")
  meta_title = models.CharField(max_length=350, null=True, blank=True, verbose_name="Мета заголовок")
  meta_description = models.TextField(null=True, blank=True, verbose_name="Meta описание")
  meta_keywords = models.CharField(max_length=350, null=True, blank=True, verbose_name="Meta keywords")
  reviews_code = models.TextField(null=True, blank=True, verbose_name="Код отзывов(Iframe/Script)")

class About(SingletonModel):
  meta_h1 = models.CharField(max_length=250, blank=True, null=True, verbose_name="Заголовок первого уровня")
  meta_title = models.CharField(max_length=350, null=True, blank=True, verbose_name="Мета заголовок")
  meta_description = models.TextField(null=True, blank=True, verbose_name="Meta описание")
  meta_keywords = models.CharField(max_length=350, null=True, blank=True, verbose_name="Meta keywords")
  content = QuillField(blank=True, null=True, verbose_name="Контент страницы",)


class Slider(models.Model):
  image = models.FileField(upload_to="home-page/", blank=True, null=True, verbose_name="Изображение")
  title = models.CharField(max_length=250, null=True, blank=True, verbose_name="Alt/Title")
  status = models.CharField(max_length=20, choices=StatusChoices.choices, verbose_name="Статус")

class ContactPhones(models.Model):
  phone = models.CharField(max_length=250, null=True, blank=True, verbose_name="Номер телефона")
  status = models.CharField(max_length=20, choices=StatusChoices.choices, verbose_name="Статус")
  view = models.CharField(max_length=20, null=True, blank=True, choices=ViewsChoices.choices, verbose_name="Отображать в шапке сайта")

class Emails(models.Model):
  email = models.EmailField(max_length=250, null=True, blank=True, unique=True, verbose_name="Email")
  status = models.CharField(max_length=20, choices=StatusChoices.choices, verbose_name="Статус")

class Socials(models.Model):
  name = models.CharField(max_length=250, null=True, blank=True, verbose_name="Название")
  image = models.FileField(upload_to='social/', blank=True, null=True, verbose_name="Иконка")
  link = models.CharField(max_length=250, null=True, blank=True, verbose_name="Ссылка")
  status = models.CharField(max_length=20, choices=StatusChoices.choices, verbose_name="Статус")

class RobotsTxt(models.Model):
  content = models.TextField(default="User-agent: *\nDisallow: /admin/")
    
  def __str__(self):
    return "robots.txt"