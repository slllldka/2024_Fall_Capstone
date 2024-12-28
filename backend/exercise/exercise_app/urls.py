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
    path('body_info', bodyInfo, name = 'bodyInfo'),
    path('weight', weight, name = 'weight'),
    path('muscle', muscle, name = 'muscle'),
    path('plan', exercisePlan, name = 'exercisePlan'),
    path('edit_default', editDefaultExercise, name = 'editDefaultExercise'),
    path('done_exercise', doneExercise, name = 'doneExercise'),
    
    path('weight_count', weightCount, name='weightCount'),
    path('weight_list', weightList, name='weightList'),
    path('five_day_exercise_calorie', fiveDayExerciseCalorie, name='fiveDayExerciseCalorie'),
    
    ###path('login', login, name = 'login'),
    ###path('user/id/<int:id>', UserID.as_view(),name ='id')
]
