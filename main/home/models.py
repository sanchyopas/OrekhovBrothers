from django.db import models
from django.urls import reverse
from admin.singleton_model import SingletonModel
from django_quill.fields import QuillField

class StatusChoices(models.TextChoices):
  PUBLISHED = "published", "Опубликовано"
  DRAFT = "draft", "Черновик"


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


class HomeTemplate(SingletonModel):
  meta_h1 = models.CharField(max_length=250, blank=True, null=True, verbose_name="Заголовок первого уровня")
  subtitle = QuillField()
  image = models.FileField(upload_to="home-page/", blank=True, null=True, verbose_name="Подложка")
  meta_title = models.CharField(max_length=350, null=True, blank=True, verbose_name="Мета заголовок")
  meta_description = models.TextField(null=True, blank=True, verbose_name="Meta описание")
  meta_keywords = models.CharField(max_length=350, null=True, blank=True, verbose_name="Meta keywords")
  left_text = QuillField(blank=True, null=True)
  right_text = QuillField(blank=True, null=True)

class Slider(models.Model):
  image = models.FileField(upload_to="home-page/", blank=True, null=True, verbose_name="Изображение")
  title = models.CharField(max_length=250, null=True, blank=True, verbose_name="Alt/Title")
  status = models.CharField(max_length=20, choices=StatusChoices.choices)

class RobotsTxt(models.Model):
  content = models.TextField(default="User-agent: *\nDisallow: /admin/")
    
  def __str__(self):
    return "robots.txt"

