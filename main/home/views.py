import json
import logging
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.core.paginator import Paginator
from home.models import *
from shop.models import *
from home.forms import *
from django.contrib import messages
from home.callback_send import email_callback
from django.conf import settings
from django.views.decorators.http import require_POST

logger = logging.getLogger(__name__)

def format_price(value) -> str:
    if value in (None, "", 0, "0"):
        return ""

    try:
        number = float(value)

        if number.is_integer():
            return (
                f"{int(number):,}"
                .replace(",", " ")
                + " ₽"
            )

        return (
            f"{number:,.2f}"
            .replace(",", " ")
            + " ₽"
        )
    except (TypeError, ValueError):
        return str(value)


def build_callback_message(
    name: str,
    phone: str,
    product_data: dict,
) -> str:
    product = product_data.get("product", {})
    configuration = product_data.get(
        "configuration",
        [],
    )
    additional_options = product_data.get(
        "additionalOptions",
        [],
    )

    lines = [
        "Новая заявка с сайта",
        "",
        f"Имя: {name}",
        f"Телефон: {phone}",
    ]

    if product:
        lines.extend([
            "",
            "Товар:",
            (
                "Название: "
                f"{product.get('name') or 'Не указано'}"
            ),
            (
                "Расчётная стоимость: "
                f"{product.get('totalPrice') or 'Не указана'}"
            ),
            (
                "Страница: "
                f"{product.get('pageUrl') or 'Не указана'}"
            ),
            (
                "Изображение: "
                f"{product.get('image') or 'Не указано'}"
            ),
        ])

    lines.extend([
        "",
        "Выбранные параметры:",
    ])

    if configuration:
        for item in configuration:
            field = item.get("field") or "Параметр"
            value = item.get("value") or "Не указано"
            price = format_price(item.get("price"))

            text = f"• {field}: {value}"

            if price:
                text += f" — {price}"

            lines.append(text)
    else:
        lines.append("Не выбраны")

    lines.extend([
        "",
        "Дополнительные опции:",
    ])

    if additional_options:
        for option in additional_options:
            option_name = (
                option.get("name")
                or "Опция"
            )
            price = format_price(
                option.get("price")
            )

            text = f"• {option_name}"

            if price:
                text += f" — {price}"

            lines.append(text)
    else:
        lines.append("Не выбраны")

    return "\n".join(lines)


@require_POST
def callback(request):
    form = CallbackForm(request.POST)

    if not form.is_valid():
        return JsonResponse(
            {
                "success": False,
                "message": (
                    "Проверьте заполнение формы"
                ),
                "errors": form.errors.get_json_data(),
            },
            status=400,
        )

    name = form.cleaned_data["name"].strip()
    phone = form.cleaned_data["phone"].strip()
    raw_product_data = form.cleaned_data.get(
        "product_data",
        "",
    )

    try:
        product_data = (
            json.loads(raw_product_data)
            if raw_product_data
            else {}
        )
    except json.JSONDecodeError:
        return JsonResponse(
            {
                "success": False,
                "message": (
                    "Некорректные параметры товара"
                ),
            },
            status=400,
        )

    product_name = (
        product_data
        .get("product", {})
        .get("name", "")
    )

    title = (
        f"Новая заявка: {product_name}"
        if product_name
        else "Заказ обратного звонка"
    )

    message = build_callback_message(
        name=name,
        phone=phone,
        product_data=product_data,
    )

    try:
        sent_count = email_callback(
            message=message,
            title=title,
        )
    except Exception as error:
        logger.exception(
            "Ошибка отправки письма"
        )

        response = {
            "success": False,
            "message": (
                "Не удалось отправить заявку"
            ),
        }

        if settings.DEBUG:
            response["debug"] = (
                f"{type(error).__name__}: {error}"
            )

        return JsonResponse(
            response,
            status=500,
        )

    if sent_count != 1:
        return JsonResponse(
            {
                "success": False,
                "message": (
                    "Письмо не было отправлено"
                ),
            },
            status=500,
        )

    return JsonResponse({
        "success": True,
        "message": "Форма успешно отправлена",
    })

def index(request):
  try:
    settings = HomeTemplate.objects.get()
  except:
    settings = HomeTemplate.load()

  categories = Category.objects.filter(status='published')
  slides = Slider.objects.filter(status='published')
  context = {
    "settings": settings,
    "categories": categories,
    "slides": slides
  }

  return render(request, 'pages/index.html', context)

def contact(request):

  context = {
  }

  return render(request, 'pages/contact.html', context)

def reviews(request):
  try:
    settings = Reviews.objects.get()
  except:
    settings = Reviews.load()

  context = {
    "settings":settings
  }

  return render(request, 'pages/reviews.html', context)

def about(request):
  try:
    settings = About.objects.get()
  except:
    settings = About.load()

  context = {
    "settings":settings
  }

  return render(request, 'pages/about.html', context)

def privacy(request):
  return render(request, "pages/privacy.html")

def cookie(request):
  return render(request, "pages/cookie.html")

def robots_txt(request):
  try:
      robots_txt = RobotsTxt.objects.first()  # Получаем первую запись, т.к. нам нужен только один robots.txt
      content = robots_txt.content if robots_txt else "User-agent: *\nDisallow: /admin/"
  except RobotsTxt.DoesNotExist:
    content = "User-agent: *\nDisallow: /admin/"

  return HttpResponse(content, content_type="text/plain")