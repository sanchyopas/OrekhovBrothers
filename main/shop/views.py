from django.shortcuts import render, get_object_or_404, get_list_or_404
from django.core.paginator import Paginator
import re

# Импорт моделей из файла models текущего каталога
from .models import *

def category(request):
  try:
    settings = ShopSettings.objects.get()
  except:
    settings = ShopSettings()

  categories = Category.objects.filter(status='published')

  context = {
    "settings": settings,
    "categories": categories,
  }

  return render(request, "pages/catalog/category.html", context)


def category_detail(request, slug):
  category = get_object_or_404(Category, slug=slug)
  categories = Category.objects.filter(status='published').exclude(id=category.id)
  products = Product.objects.filter(category=category)

  # Очищаем описания продуктов от &nbsp; перед передачей в шаблон
  for product in products:
    if product.description:
      # Удаляем теги и заменяем &nbsp; на обычный пробел
      clean_text = re.sub(r'<[^>]*>', '', product.description)
      product.clean_description = clean_text.replace('&nbsp;', ' ').strip()
      print(product.description)

  context = {
    "products": products,
    "category": category,
    "categories": categories
  }

  return render(request, "pages/catalog/category-details.html", context)

def product(request, parent, slug):
  product = Product.objects.get(slug=slug)
  category = Category.objects.get(slug=parent)

  context = {
    "category": category,
    "product": product
  }

  return render(request, "pages/catalog/product.html", context)

