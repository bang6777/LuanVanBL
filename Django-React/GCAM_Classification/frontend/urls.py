from django.urls import path
from .views import index, Predict_Human, GradCamUI, GradCam
urlpatterns = [
    path('', index),
    path('ClsClick', Predict_Human),
    path('GradCamUI', GradCamUI),
    path('GradCAMClick', GradCam)
]
