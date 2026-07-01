from django.urls import path
from shop import views

urlpatterns = [
  path('tabs/create/', views.create_tab, name="create_tab"),
  path('fields/create/', views.create_field, name="create_field"),
  path('options/create/', views.create_options, name="create_options"),
  path('item/delete/', views.item_remove, name="item_remove"),
  path('item/update/',views.update_config_item, name='update_config_item'),
  path('', views.category, name="category"),
  path('<slug:slug>/', views.category_detail, name="category_detail"),
  path('<slug:parent>/<slug:slug>/', views.product, name="product"),
]