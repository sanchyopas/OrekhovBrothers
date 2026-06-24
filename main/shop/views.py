from django.shortcuts import render, get_object_or_404, get_list_or_404
from django.core.paginator import Paginator
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
from django.utils.html import strip_tags
import re
import json

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

  images = ProductImage.objects.filter(parent=product)
  config = ConfigTab.objects.filter(category=category)

  context = {
    "category": category,
    "product": product,
    "images": images,
    "config": config
  }

  return render(request, "pages/catalog/product.html", context)


@require_http_methods(["POST"])
def create_tab(request):
    """Создание новой вкладки"""
    try:
        title = request.POST.get('title', '').strip()
        category_id = request.POST.get('category')

        # Валидация
        if not title:
            return JsonResponse({
                'status': False,
                'error': 'Название вкладки обязательно'
            }, status=400)

        if len(title) < 2:
            return JsonResponse({
                'status': False,
                'error': 'Название должно содержать минимум 2 символа'
            }, status=400)

        if not category_id:
            return JsonResponse({
                'status': False,
                'error': 'ID категории обязателен'
            }, status=400)

        # Создаём вкладку
        tab = ConfigTab.objects.create(
            category_id=category_id,
            title=title,
        )

        return JsonResponse({
            'status': True,
            'id': tab.id,
            'title': tab.title,
        })

    except Exception as e:
        return JsonResponse({
            'status': False,
            'error': str(e)
        }, status=500)


@require_http_methods(["POST"])
def create_field(request):
    """Создание нового поля"""
    try:
        # ВАЖНО: используем 'title' как в JS, а не 'name'
        title = request.POST.get('name', '').strip()
        field_type = request.POST.get('type', 'text')
        tab_id = request.POST.get('id')

        # Валидация
        if not title:
            return JsonResponse({
                'status': False,
                'error': 'Название поля обязательно'
            }, status=400)

        if not tab_id:
            return JsonResponse({
                'status': False,
                'error': 'ID вкладки обязателен'
            }, status=400)

        # Проверяем существует ли вкладка
        try:
            tab = ConfigTab.objects.get(id=tab_id)
        except ConfigTab.DoesNotExist:
            return JsonResponse({
                'status': False,
                'error': 'Вкладка не найдена'
            }, status=404)

        # Создаём поле
        field = ConfigField.objects.create(
            tab_id=tab_id,
            title=title,
            field_type=field_type
        )

        return JsonResponse({
            'status': True,
            'id': field.id,
            'title': field.title,
            'type': field.field_type,
        })

    except Exception as e:
        return JsonResponse({
            'status': False,
            'error': str(e)
        }, status=500)


@require_http_methods(["POST"])
def create_options(request):
    """Создание новой опции для поля"""
    try:
        title = request.POST.get('title', '').strip()
        price = request.POST.get('price', 0)
        field_id = request.POST.get('id')

        # Валидация
        if not title:
            return JsonResponse({
                'status': False,
                'error': 'Название опции обязательно'
            }, status=400)

        if not field_id:
            return JsonResponse({
                'status': False,
                'error': 'ID поля обязателен'
            }, status=400)

        # Преобразуем цену
        try:
            price = int(price) if price else 0
        except (ValueError, TypeError):
            price = 0

        # Проверяем существует ли поле
        try:
            field = ConfigField.objects.get(id=field_id)
        except ConfigField.DoesNotExist:
            return JsonResponse({
                'status': False,
                'error': 'Поле не найдено'
            }, status=404)

        # Создаём опцию
        option = ConfigFieldOption.objects.create(
            field=field,
            title=title,
            price=price
        )

        return JsonResponse({
            'status': True,
            'id': option.id,
            'title': option.title,
            'price': option.price,
        })

    except Exception as e:
        return JsonResponse({
            'status': False,
            'error': str(e)
        }, status=500)


def item_remove(request):
  try:
    data = json.loads(request.body)

    item = data.get('item', '')
    item_id = data.get('id')

    if(item == 'tab'):
      print('tab')

    if(item == 'field'):
      print('field')

    if(item == 'option'):
      print('option')
      ConfigFieldOption.objects.get(id=item_id).delete()

    return JsonResponse({
        'status': True,
    })

  except Exception as e:
    return JsonResponse({
      'status': False,
      'error': str(e)
    })
