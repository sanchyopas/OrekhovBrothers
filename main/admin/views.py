import os
import zipfile
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import redirect, render, get_object_or_404
from django.urls import reverse
from django.contrib import messages
from admin.forms import *
from home.models import *
from main.settings import BASE_DIR
from shop.models import *
from .utils.views import *

#Нужные импорты
from slugify import slugify

from django.core.paginator import Paginator
from django.shortcuts import render, get_object_or_404, get_list_or_404
from django.core.files.images import ImageFile
from django.contrib.auth.decorators import user_passes_test
import uuid
from django.core.exceptions import ObjectDoesNotExist
from django.db import IntegrityError
import logging
logger = logging.getLogger(__name__)


import unicodedata

# @user_passes_test(lambda u: u.is_superuser)
import urllib.parse

@user_passes_test(lambda u: u.is_superuser)
def admin(request):
  """Данная предстовление отобразает главную страницу админ панели"""
  return render(request, "page/index.html")

@user_passes_test(lambda u: u.is_superuser)
def robots(request):
  try:
    robots = RobotsTxt.objects.get()
  except:
    robots = RobotsTxt()
    robots.save()

  if request.method == "POST":
    form_new = RobotsForm(request.POST, request.FILES, instance=robots)
    if form_new.is_valid():
      form_new.save()

      return redirect(request.META.get('HTTP_REFERER'))
    else:
      return render(request, "common-template/robots.html", {"form": form_new})

  robots = RobotsTxt.objects.get()

  form = RobotsForm(instance=robots)

  context = {
    "form": form,
    "robots":robots
  }

  return render(request, "common-template/robots.html", context)

@user_passes_test(lambda u: u.is_superuser)
def templates(request):
  return render(request, 'page/template.html')

# Новые views

""" Общие настройки сайта """
@user_passes_test(lambda u: u.is_superuser)
def admin_settings(request):
  return generic_singleton_edit(request, GlobalSettingsForm, BaseSettings, "Общие настройки", template_name=None)


""" Настройки главной страницы """
@user_passes_test(lambda u: u.is_superuser)
def admin_home_page(request):
  try:
    instance = HomeTemplate.objects.get()
  except model_class.DoesNotExist:
    instance = HomeTemplate()
    instance.save()
  except Exception as e:
    messages.error(request, f"Ошибка: {e}")
    return redirect(request.META.get('HTTP_REFERER'))

  slides = Slider.objects.filter(status='published')

  if request.method == "POST":
    form = HomeTemplateForm(request.POST, request.FILES, instance=instance)

    if form.is_valid():
      try:
        saved_instance = form.save()
        messages.success(request, "Успешно сохранено!")
        return redirect(request.META.get('HTTP_REFERER'))
      except Exception as e:
        messages.error(request, f"Ошибка сохранения: {e}")
    else:
      return render(request, "page/_home-page.html", {
        "form": form,
        "title": 'Настройки главной страницы',
        "settings": instance,
        "slides": slides,
      })

  form = HomeTemplateForm(instance=instance)

  context = {
    "form": form,
    "title": 'Настройки главной страницы',
    "settings": instance,
    "slides": slides,
  }
  return render(request, "page/_home-page.html", context)

""" Категории товаров """
@user_passes_test(lambda u: u.is_superuser)
def admin_category(request):
  return generic_list(request, Category, "Категории проектов", "category_add", "category_edit", "category_delete")

@user_passes_test(lambda u: u.is_superuser)
def category_add(request):
  return generic_add(request, CategoryForm, "admin_category", "Добавление",  template_name="category/template-edit.html")

@user_passes_test(lambda u: u.is_superuser)
def category_edit(request, pk):
  """Универсальное редактирование"""

  item = get_object_or_404(Category, id=pk)
  tabs = ConfigTab.objects.filter(category=item)

  if request.method == "POST":
    form = CategoryForm(request.POST, request.FILES, instance=item)
    if form.is_valid():
      form.save()
      messages.success(request, "Успешно сохранено !")
      return redirect(request.META.get('HTTP_REFERER'))
    else:
      return render(request, "category/template-edit.html", {"form": form, "item": item})

  form = CategoryForm(instance=item)
  context = {
      "tabs": tabs,
      "form": form,
      "item": item,
      "title": "Редактирование",
  }
  return render(request, "category/template-edit.html", context)

@user_passes_test(lambda u: u.is_superuser)
def category_delete(request, pk):
  return generic_delete(request, Category, pk)


""" Настройки страницы каталога """
@user_passes_test(lambda u: u.is_superuser)
def admin_shop(request):
  return generic_singleton_edit(
  request,
  ShopSettingsForm,
  ShopSettings,
  "Настройки страницы каталога",
  template_name="common-template/singleton_page_edit.html",
  )

""" Настройки страницы отзывов """
@user_passes_test(lambda u: u.is_superuser)
def admin_reviews(request):
  return generic_singleton_edit(
  request,
  ReviewsForm,
  Reviews,
  "Настройки страницы отзывов",
  template_name="page/_reviews-page.html",
  )
@user_passes_test(lambda u: u.is_superuser)
def admin_about(request):
  return generic_singleton_edit(
  request,
  AboutForm,
  About,
  "Настройки страницы о компании",
  template_name="page/_about-page.html",
  )

""" Товары """
@user_passes_test(lambda u: u.is_superuser)
def admin_product(request):
  return generic_list(request, Product, "Проекты", "product_add", "product_edit", "product_delete")

@user_passes_test(lambda u: u.is_superuser)
def product_edit(request, pk):
  """
    View, которая получает данные из формы редактирования товара
    и изменяет данные внесенные данные товара в базе данных
  """
  product = Product.objects.get(id=pk)
  images = ProductImage.objects.filter(parent_id=pk)
  form = ProductForm(instance=product)
  form_new = ProductForm(request.POST, request.FILES, instance=product)

  if request.method == 'POST':
    if form_new.is_valid():
      form_new.save()
      product = Product.objects.get(id=pk)
      images = request.FILES.getlist('src')

      for image in images:
        img = ProductImage(parent=product, src=image)
        img.save()

      messages.success(request, "Успешно сохранено !")
      return redirect(request.META.get('HTTP_REFERER'))
    else:
      error_list = []

      for field_name, errors in form.errors.items():
        if field_name == "__all__":
          for error in errors:
            error_list.append(error)
          continue
        field_label = form[field_name].label

        for error in errors:
          error_list.append(f"{field_label}: {error}")
      messages.error(request, " | ".join(error_list))
      return render(request, 'product/template-edit.html', {'form': form_new})

  context = {
    "form": form,
    "title": "Страница редактирования",
    "images": images,
    "product_view": True
  }

  return render(request, "product/template-edit.html", context)

@user_passes_test(lambda u: u.is_superuser)
def product_add(request):
  return generic_add(request, ProductForm, "admin_shop", "Добавление Товара",  template_name="common-template/product-edit-add-page.html")

@user_passes_test(lambda u: u.is_superuser)
def product_delete(request,pk):
  return generic_delete(request, Product, pk)

@user_passes_test(lambda u: u.is_superuser)
def product_image_delete(request,pk):
  return generic_delete(request, ProductImage, pk)

@user_passes_test(lambda u: u.is_superuser)
def admin_char_model(request):
  return generic_list(request, Characteristic, "Характеристики модели", "model_char_add", "model_char_edit", "char_delete")

@user_passes_test(lambda u: u.is_superuser)
def model_char_add(request):
  return generic_add(request, CharacteristicForm, "admin_char_model", "Добавление характеристики",  template_name="common-template/product-edit-add-page.html")

@user_passes_test(lambda u: u.is_superuser)
def model_char_edit(request, pk):
  return generic_edit(request,  pk, Characteristic,  CharacteristicForm, "admin_char_model", "Редактирование характеристик", template_name=None)

def slider(request):
  return generic_list(request, Slider, "Слайдер", "slider_add", "slider_edit", "slider_delete")

def slider_add(request):
  form = SliderForm()
  if request.method == 'POST':
    form = SliderForm(request.POST, request.FILES)
    if form.is_valid():
      form.save()
      messages.success(request, 'Успешно сохранено !')
      return redirect(request.META.get('HTTP_REFERER'))
    else:
      error_list = []
      for field_name, errors in form.errors.items():
        # если ошибка не привязана к полю (non_field_errors)
        if field_name == "__all__":
          for error in errors:
            error_list.append(error)
          continue

        # получаем label поля
        field_label = form[field_name].label

        for error in errors:
          error_list.append(f"{field_label}: {error}")
      messages.error(request, " | ".join(error_list))
      return render(request, "common-template/template-edit-add-page.html", {"form": form, "title": "Добавление слайдера"})
  context = {
    "form": form,
    "title": 'Добавление слайдера'
  }
  return render(request, "common-template/template-edit-add-page.html", context)

def slider_edit(request, pk):
  pass

def slider_delete(request, pk):
  pass

""" Социальные сети """
@user_passes_test(lambda u: u.is_superuser)
def socials(request):
    return generic_list(request, Socials, "Соц.сети", "socials_add", "socials_edit", "socials_delete")

@user_passes_test(lambda u: u.is_superuser)
def socials_add(request):
    return generic_add(request, SocialsForm, "socials", "Добавление соц.сети",  template_name="socials/template-edit.html")

@user_passes_test(lambda u: u.is_superuser)
def socials_edit(request, pk):
  return generic_edit(request, pk, Socials, SocialsForm, "socials", "Редактирование соц.сети",  template_name="socials/template-edit.html")

@user_passes_test(lambda u: u.is_superuser)
def socials_delete(request, pk):
    return generic_delete(request, Socials, pk)


""" Номера телефонов """
@user_passes_test(lambda u: u.is_superuser)
def phones(request):
  return generic_list(request, ContactPhones, "Телефоны", "phones_add", "phones_edit", "phones_delete")

@user_passes_test(lambda u: u.is_superuser)
def phones_add(request):
  return generic_add(request, ContactPhonesForm, "phones", "Добавление телефонов",  template_name="phones/template-edit.html")

@user_passes_test(lambda u: u.is_superuser)
def phones_edit(request, pk):
  return generic_edit(request, pk, ContactPhones, ContactPhonesForm, "phones", "Редактирование телефонов",  template_name="phones/template-edit.html")

@user_passes_test(lambda u: u.is_superuser)
def phones_delete(request, pk):
  return generic_delete(request, ContactPhones, pk)

""" Emails """
@user_passes_test(lambda u: u.is_superuser)
def emails(request):
  return generic_list(request, Emails, "Emails", "emails_add", "emails_edit", "emails_delete")

@user_passes_test(lambda u: u.is_superuser)
def emails_add(request):
  return generic_add(request, EmailsForm, "emails", "Добавление email",  template_name=None)

@user_passes_test(lambda u: u.is_superuser)
def emails_edit(request, pk):
  return generic_edit(request, pk, Emails, EmailsForm, "emails", "Редактирование email",  template_name=None)

@user_passes_test(lambda u: u.is_superuser)
def emails_delete(request, pk):
    return generic_delete(request, Emails, pk)



