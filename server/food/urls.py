from django.urls import path, include
from rest_framework import routers
from . import views
from .views import *
###from .api import *

router = routers.DefaultRouter() #DefaultRouter를 설정
###router.register('User', views.UserViewSet) #itemviewset 과 item이라는 router 등록

urlpatterns = [
    path('', include(router.urls)),
    path('user_allergy', userAllergy, name='userAllergy'),
    path('keyword', foodKeyword, name='foodKeyword'),
    path('ingredient_by_food', getIngredientByFood, name='getIngredientByFood'),
    path('food_by_ingredient', getFoodByIngredient, name='getFoodByIngredient'),
    path('food_ingredient', foodIngredient, name='foodIngredient'),
    path('check_vegan', checkVegan, name='checkVegan'),
    path('food_text', foodText, name='foodText'),
    path('fridge_image', fridgeImage, name='fridgeImage'),
    path('select_food', selectFood, name='selectFood'),
    ###path('login', login, name = 'login'),
    ###path('user/id/<int:id>', UserID.as_view(),name ='id')
]