from django.urls import path
from .views import index, Predict_Human, GradCamUI
urlpatterns = [
    path('', index),
    path('ClsClick', Predict_Human),
    path('GradCamUI', GradCamUI)
]
