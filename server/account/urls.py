from django.urls import path, include
from rest_framework import routers
from . import views
from .views import *
from .api import *

router = routers.DefaultRouter() #DefaultRouter를 설정
router.register('User', views.UserViewSet) #itemviewset 과 item이라는 router 등록

urlpatterns = [
    path('', include(router.urls)),
    path('login', login, name = 'login'),
    path('signup', signup, name = 'signup'),
    path('valid', valid, name = 'valid'),
    path('refresh', refresh, name = 'refresh'),
    path('myinfo', myinfo, name = 'myinfo'),
    path('user/id/<int:id>', UserID.as_view(),name ='id'),
]
