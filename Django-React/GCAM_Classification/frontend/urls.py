from django.urls import path
from .views import index, Predict_Human,GradCam
urlpatterns = [
    path('', index),
    path('ClsClick', Predict_Human),
    path('upload', pathImg),
    path('handleCLick', GradCam),
]
