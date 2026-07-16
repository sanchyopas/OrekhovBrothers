DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'sanchyopas_oreh',
        'USER': 'sanchyopas_oreh',
        'PASSWORD': 'Ba1QJpGn&ZUr',
        'HOST': 'localhost',
    }
}

INSTALLED_APPS = [
    # "django.contrib.admin",
    "admin",
    'accounts',
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    'django_ckeditor_5',
    'django_quill',
    "debug_toolbar",
    'sorl.thumbnail',
    'django.contrib.sitemaps',
    "corsheaders",
    "home",
    "shop",
    "users",
    'django.contrib.sites',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    'whitenoise.middleware.WhiteNoiseMiddleware',
    # "debug_toolbar.middleware.DebugToolbarMiddleware",
    # "corsheaders.middleware.CorsMiddleware",
    # 'allauth.account.middleware.AccountMiddleware',
]

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'console': {
            'format': '%(name)-12s %(levelname)-8s %(message)s'
        },
        'file': {
            'format': '%(asctime)s %(name)-12s %(levelname)-8s %(message)s'
        }
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'console'
        },
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'formatter': 'file',
            'filename': '/home/s/sanchyopas/orehovbrothers.sanchyopas.beget.tech/public_html/debug.log'
        }
    },
    'loggers': {
        '': {
            'level': 'INFO',
            'handlers': ['console', 'file'],
        },
        'myapp_test': {
            'level': 'INFO',
            'handlers': ['console', 'file'],
            'propagate': False,
        },
    }
}


