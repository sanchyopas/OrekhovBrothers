from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.core.paginator import Paginator
from home.models import *
from shop.models import *
from home.forms import *
from django.contrib import messages
from home.callback_send import email_callback

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