from django.urls import path
from .views import index, ClsClick, hello
urlpatterns = [
    path('', index),
    path('ClsClick', hello),
    # path('hello', views.hello, name="a")
]
