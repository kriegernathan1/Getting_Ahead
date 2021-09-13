from django.urls import path, re_path
from django.views.generic import RedirectView
from django.views.generic import TemplateView
from . import views

urlpatterns = [
    re_path('/Today', views.index),
    re_path('/MyTasks', views.index),
    re_path('/username', views.username),
    re_path('/register', views.registerForm),
    re_path('', views.home)
]