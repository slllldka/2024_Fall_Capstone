from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from datetime import timedelta
from .models import *

@api_view(['GET'])
def weightCount(request):
    user_id = request.query_params.get('id')
    count = UserWeight.objects.filter(user_id=user_id).count()
    return Response({'weight_count':count})

@api_view(['GET'])
def weightList(request):
    user_id = request.query_params.get('id')
    _set = UserWeight.objects.filter(user_id=user_id).order_by('-date')[:3]
    _list = list(_set.values('weight'))
    return Response({'weight_set': _list})

#paramter date
@api_view(['GET'])
def fiveDayExerciseCalorie(request):
    user_id = request.query_params.get('id')
    user_gender = request.query_params.get('gender')
    date = request.query_params.get('date')
    _set = UserExerciseDone.objects.filter(user_id = user_id,
                date__gte=date - timedelta(days=4), date__lte=date)
    calorie = 0
    for exercise in _set:
        if user_gender == 'male':
            calorie += exercise.exercise_id.calorie_male
        elif user_gender == 'female':
            calorie += exercise.exercise_id.calorie_female
    return Response({'calorie':calorie})