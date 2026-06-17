from django.urls import path

from home import views

urlpatterns = [
    path('privacy/', views.privacy, name="privacy"),
    path('cookie/', views.cookie, name="cookie"),
    path('contact/', views.contact, name="contact"),
    path('reviews/', views.reviews, name="reviews"),
    path('about/', views.about, name="about"),
    path('robots.txt', views.robots_txt),
    path('', views.index, name="home"),
]