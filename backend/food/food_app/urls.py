from django.urls import path, include
from rest_framework import routers
from . import views
from .views import *
from .views_micro import *
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
    path('food_info', foodInfo, name='foodInfo'),
    path('select_food', selectFood, name='selectFood'),
    path('remain_calorie', remainCalorie, name='remainCalorie'),
    
    path('five_day_calorie_count', fiveDayCalorieCount, name='fiveDayCalorieCount'),
    path('five_day_calorie_list', fiveDayCalorieList, name='fiveDayCalorieList'),
    
    ###path('login', login, name = 'login'),
    ###path('user/id/<int:id>', UserID.as_view(),name ='id')
    # path('analyze/', FoodTextAnalysis.as_view(), name='food-text-analysis'),
]