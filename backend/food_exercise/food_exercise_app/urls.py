from django.urls import path, include
from rest_framework import routers
from . import views
from .views import *
###from .api import *

router = routers.DefaultRouter() #DefaultRouter를 설정
###router.register('User', views.UserViewSet) #itemviewset 과 item이라는 router 등록

urlpatterns = [
    path('', include(router.urls)),
    path('calorie_bound', calorie_bound, name='calorie_bound')
]