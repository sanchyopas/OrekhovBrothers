from django.db import models
from django.urls import reverse
from admin.singleton_model import SingletonModel
from django_quill.fields import QuillField

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
  phone = models.CharField(max_length=50, blank=True, null=True, db_index=True, verbose_name="Основной телефона")
  additional_phone = models.CharField(max_length=50, blank=True, null=True, db_index=True, verbose_name="Дополнительный телефона")
  email = models.EmailField(max_length=250, blank=True, null=True, db_index=True, verbose_name="Email")
  address = models.CharField(max_length=250, blank=True, null=True, verbose_name="Адрес")
  favicon = models.FileField(upload_to='base-settings/', blank=True, null=True, verbose_name="ФавИконка")
  inn = models.CharField(max_length=50, blank=True, null=True, verbose_name="ИНН")
  copyright = models.CharField(max_length=250, blank=True, null=True, verbose_name="Копирайт")
  map = models.TextField(null=True, blank=True, verbose_name="Код карты")


class HomeTemplate(SingletonModel):
  meta_h1 = models.CharField(max_length=250, blank=True, null=True, verbose_name="Заголовок первого уровня")
  subtitle = QuillField()
  image = models.FileField(upload_to="home-page/", blank=True, null=True, verbose_name="Подложка")
  meta_title = models.CharField(max_length=350, null=True, blank=True, verbose_name="Мета заголовок")
  meta_description = models.TextField(null=True, blank=True, verbose_name="Meta описание")
  meta_keywords = models.CharField(max_length=350, null=True, blank=True, verbose_name="Meta keywords")
  left_text = QuillField(blank=True, null=True)
  right_text = QuillField(blank=True, null=True)

class Reviews(SingletonModel):
  meta_h1 = models.CharField(max_length=250, blank=True, null=True, verbose_name="Заголовок первого уровня")
  meta_title = models.CharField(max_length=350, null=True, blank=True, verbose_name="Мета заголовок")
  meta_description = models.TextField(null=True, blank=True, verbose_name="Meta описание")
  meta_keywords = models.CharField(max_length=350, null=True, blank=True, verbose_name="Meta keywords")
  reviews_code = models.TextField(null=True, blank=True, verbose_name="Код отзывов(Iframe/Script)")


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