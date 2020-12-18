from django.urls import path
from .views import index, Predict_Human, hello, pathImg
urlpatterns = [
    path('', index),
    path('ClsClick', Predict_Human),
    path('upload', pathImg)
]
