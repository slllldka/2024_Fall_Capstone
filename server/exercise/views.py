from django.shortcuts import render
from django.contrib.auth import authenticate

from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from django.utils import timezone

from django.db import IntegrityError

from django.forms.models import model_to_dict

from .models import *

# Create your views here.

#get, post bodymetrics
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def bodyMetrics(request):
    user = request.user
    if request.method == 'GET':
        try:
            userBodyInfo = UserBodyInfo.objects.get(user_id = user.id)
        except UserBodyInfo.DoesNotExist:
            return Response({'error':'UserBodyInfo does not exist'}, status=status.HTTP_404_NOT_FOUND)
        return Response(model_to_dict(userBodyInfo))
    elif request.method == 'POST':
        #Required
        height = request.data.get('height')
        weight = request.data.get('weight')
        weight_goal = request.data.get('weight_goal')
        period_goal = request.data.get('period_goal')
        duration = request.data.get('duration')
        #optional
        right_arm_muscle_mass = request.data.get('right_arm')
        right_arm_muscle_mass = 0 if right_arm_muscle_mass is None else right_arm_muscle_mass
        left_arm_muscle_mass = request.data.get('left_arm')
        left_arm_muscle_mass = 0 if left_arm_muscle_mass is None else left_arm_muscle_mass
        body_muscle_mass = request.data.get('body')
        body_muscle_mass = 0 if body_muscle_mass is None else body_muscle_mass
        right_leg_muscle_mass = request.data.get('right_leg')
        right_leg_muscle_mass = 0 if right_leg_muscle_mass is None else right_leg_muscle_mass
        left_leg_muscle_mass = request.data.get('left_leg')
        left_leg_muscle_mass = 0 if left_leg_muscle_mass is None else left_leg_muscle_mass
        muscle_goal = request.data.get('muscle_goal')
        muscle_goal = 0 if muscle_goal is None else muscle_goal
        try:
            userBodyInfo = UserBodyInfo.objects.get(user_id=user.id)
            userBodyInfo.height = height
            userBodyInfo.weight = weight
            userBodyInfo.weight_goal = weight_goal
            userBodyInfo.period_goal = period_goal
            userBodyInfo.duration = duration
            userBodyInfo.right_arm_muscle_mass = right_arm_muscle_mass
            userBodyInfo.left_arm_muscle_mass = left_arm_muscle_mass
            userBodyInfo.body_muscle_mass = body_muscle_mass
            userBodyInfo.right_leg_muscle_mass = right_leg_muscle_mass
            userBodyInfo.left_leg_muscle_mass = left_leg_muscle_mass
            userBodyInfo.muscle_goal = muscle_goal
        except UserBodyInfo.DoesNotExist:
            UserBodyInfo.objects.create(user_id=user, height = height, weight = weight, weight_goal = weight_goal, period_goal = period_goal
                                        , duration = duration, right_arm_muscle_mass = right_arm_muscle_mass, left_arm_muscle_mass = left_arm_muscle_mass
                                        , body_muscle_mass = body_muscle_mass, right_leg_muscle_mass = right_leg_muscle_mass
                                        , left_leg_muscle_mass = left_leg_muscle_mass, muscle_goal = muscle_goal)

#getm post done exercise
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def doneExercise(request):
    user = request.user
    if request.method == 'GET':
        exercise_list = []
        date_time_list = []
        duration_list = []
        doneExerciseSet = UserExercise.objects.filter(user_id = user.id).values('exercise_id', 'date_time', 'duration')
        for doneExercise in doneExerciseSet:
            #only name
            exercise_list.append(Exercise.objects.get(exercise_id=doneExercise['exercise_id']).name)
            #all info(name, muscle_part, calorie per hour or set, setnum)
            #exercise_list.append(model_to_dict(Exercise.objects.get(exercise_id=doneExercise['exercise_id'])))
            date_time_list.append(doneExercise['date_time'])
            duration_list.append(doneExerciseSet['duration'])
        return Response({'exercises':exercise_list, 'date_times':date_time_list, 'durations':duration_list})
    elif request.method == 'POST':
        exercise_name = request.data.get('exercise')
        try:
            exercise = Exercise.objects.get(name = exercise_name)
        except Exercise.DoesNotExist:
            return Response({'error':'wrong exercise'}, status=status.HTTP_400_BAD_REQUEST)
        UserExercise.objects.create(user_id = user, exercise_id = exercise)
        return Response({"success":True})
    
#exercise recommendation
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def exerciseRecommendation(request):
    #TODO Exercise Recommendation
    pass
