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
#   import_products_from_excel(path_to_excel)

  # unzip_archive()
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


# Новые views

""" Общие настройки сайта """
@user_passes_test(lambda u: u.is_superuser)
def admin_settings(request):
  return generic_singleton_edit(request, GlobalSettingsForm, BaseSettings, "Общие настройки", template_name=None)


""" Настройки главной страницы """
@user_passes_test(lambda u: u.is_superuser)
def admin_home_page(request):
  return generic_singleton_edit(request,
  HomeTemplateForm,
  HomeTemplate,
  "Настройки главной страницы",
  template_name="common-template/_home-page.html"
  )

""" Категории товаров """
@user_passes_test(lambda u: u.is_superuser)
def admin_category(request):
  return generic_list(request, Category, "Категории", "category_add", "category_edit", "category_delete")

@user_passes_test(lambda u: u.is_superuser)
def category_add(request):
  return generic_add(request, CategoryForm, "admin_category", "Добавление категории",  template_name=None)

@user_passes_test(lambda u: u.is_superuser)
def category_edit(request, pk):
  return generic_edit(  request,  pk, Category,  CategoryForm, "", "Редактирование категории", template_name=None)

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

""" Товары """
@user_passes_test(lambda u: u.is_superuser)
def admin_product(request):
  return generic_list(request, Product, "Товары", "product_add", "product_edit", "product_delete")

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
      return render(request, 'common-template/product-edit-add-page.html', {'form': form_new})

  context = {
    "form": form,
    "title": "Страница редактирования",
    "images": images,
    "product_view": True
  }

  return render(request, "common-template/product-edit-add-page.html", context)

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



