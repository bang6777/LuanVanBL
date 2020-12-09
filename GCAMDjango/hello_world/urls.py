from django.urls import path
from hello_world import views

urlpatterns = [
    path('', views.home, name='home'),
    path('readImage', views.readImage, name='readImage'),
    path('aclick', views.aclick, name='aclick'),
    # path('', views.hello_world, name='hello_world'),
]
