from django.urls import path
from . import views

# from .views_new.product_views import admin_product, product_edit, product_add,product_delete


urlpatterns = [
    path('', views.admin, name="admin"),

    path('socials/', views.socials, name='socials'),
    path('socials/add/', views.socials_add, name='socials_add'),
    path('socials/<int:pk>/edit/', views.socials_edit, name='socials_edit'),
    path('socials/<int:pk>/delete/', views.socials_delete, name='socials_delete'),


    path('phones/', views.phones, name='phones'),
    path('phones/add/', views.phones_add, name='phones_add'),
    path('phones/<int:pk>/edit/', views.phones_edit, name='phones_edit'),
    path('phones/<int:pk>/delete/', views.phones_delete, name='phones_delete'),

    path('emails/', views.emails, name='emails'),
    path('emails/add/', views.emails_add, name='emails_add'),
    path('emails/<int:pk>/edit/', views.emails_edit, name='emails_edit'),
    path('emails/<int:pk>/delete/', views.emails_delete, name='emails_delete'),

    path('home-page/', views.admin_home_page, name='admin_home_page'),
    path('reviews-page/', views.admin_reviews, name='admin_reviews'),

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

    path('slider/add/', views.slider_add, name='slider_add'),
    path('slider/<int:pk>/edit/', views.slider_edit, name='slider_edit'),
    path('slider/<int:pk>/delete/', views.slider_delete, name='slider_delete'),

]