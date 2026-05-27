from django.urls import path
from shop import views

urlpatterns = [
    path('', views.category, name="category"),
    path('<slug:slug>/', views.category_detail, name="category_detail"),
    path('<slug:parent>/<slug:slug>/', views.product, name="product"),
]