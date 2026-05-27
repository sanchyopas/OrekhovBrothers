from django.urls import path
from . import views

# from .views_new.product_views import admin_product, product_edit, product_add,product_delete


urlpatterns = [
    path('', views.admin, name="admin"),
    path('home-page/', views.admin_home_page, name='admin_home_page'),

    path('admin-shop/', views.admin_shop, name='admin_shop'),

    #URl - отвечающие за отображение категорий, редактирование и удаление категории
    path('category/', views.admin_category, name='admin_category'),
    path('category/add/', views.category_add, name='category_add'),
    path('category/<int:pk>/edit/', views.category_edit, name='category_edit'),
    path('category/<int:pk>/delete/', views.category_delete, name='category_delete'),

    path('product/', views.admin_product, name='admin_product'),
    path('product/add/', views.product_add, name='product_add'),
    path('product/<int:pk>/edit/', views.product_edit, name='product_edit'),
    path('product/<int:pk>/delete/', views.product_delete, name='product_delete'),

    path('product-image/<int:pk>/delete/', views.product_image_delete, name='product_image_delete'),

    #URl - Шаблон общих настроек сайта
    path('settings/', views.admin_settings, name='admin_settings'),
    path('robots/', views.robots, name='robots'),

]