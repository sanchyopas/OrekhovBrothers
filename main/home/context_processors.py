from home.models import *
from shop.models import Category

def load_settings(request):
    return {'base_settings': BaseSettings.load()}

def load_categories(request):
  return {'global_categories': Category.objects.filter(status='published')}

def static_theme_path(request):
    from django.conf import settings
    return {'STATIC_THEME_PATH': settings.STATIC_THEME_PATH}