from django.urls import path
from .views import index, ClsClick, hello, pathImg
urlpatterns = [
    path('', index),
    path('ClsClick', hello),
    path('upload', pathImg)
]
