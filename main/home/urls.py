from django.urls import path

from home import views

urlpatterns = [
    path('privacy/', views.privacy, name="privacy"),
    path('cookie/', views.cookie, name="cookie"),
    path('robots.txt', views.robots_txt),
    path('', views.index, name="home"),
]