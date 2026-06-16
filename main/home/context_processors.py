from home.models import *
from shop.models import Category

def load_settings(request):
    return {'base_settings': BaseSettings.load()}

def socials(request):
    return {'socials': Socials.objects.filter(status='published')}

def emails(request):
    return {'emails': Emails.objects.filter(status='published')}

def phones(request):
    return {'phones': ContactPhones.objects.filter(status='published')}

def phones_header(request):
    return {'phones_header': ContactPhones.objects.filter(view='yes')[:2]}

def load_categories(request):
  return {'global_categories': Category.objects.filter(status='published')}

def static_theme_path(request):
    from django.conf import settings
    return {'STATIC_THEME_PATH': settings.STATIC_THEME_PATH}