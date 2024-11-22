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
        return Response(model_to_dict(userBodyInfo
                                      , fields=['height', 'weight', 'duration', 'goal', 'right_arm_muscle_mass', 'left_arm_muscle_mass'
                                                , 'body_muscle_mass', 'right_leg_muscle_mass', 'left_leg_muscle_mass']))
    elif request.method == 'POST':
        needNewPlan = False
        #Required
        height = request.data.get('height')
        weight = request.data.get('weight')
        duration = request.data.get('duration')
        goal = request.data.get('goal')
        #optional
        right_arm_muscle_mass = request.data.get('right_arm')
        right_arm_muscle_mass = 0 if right_arm_muscle_mass is None else right_arm_muscle_mass
        if right_arm_muscle_mass != 0:
            needNewPlan = True
        left_arm_muscle_mass = request.data.get('left_arm')
        left_arm_muscle_mass = 0 if left_arm_muscle_mass is None else left_arm_muscle_mass
        if left_arm_muscle_mass != 0:
            needNewPlan = True
        body_muscle_mass = request.data.get('body')
        body_muscle_mass = 0 if body_muscle_mass is None else body_muscle_mass
        if body_muscle_mass != 0:
            needNewPlan = True
        right_leg_muscle_mass = request.data.get('right_leg')
        right_leg_muscle_mass = 0 if right_leg_muscle_mass is None else right_leg_muscle_mass
        if right_leg_muscle_mass != 0:
            needNewPlan = True
        left_leg_muscle_mass = request.data.get('left_leg')
        left_leg_muscle_mass = 0 if left_leg_muscle_mass is None else left_leg_muscle_mass
        if left_leg_muscle_mass != 0:
            needNewPlan = True
        try:
            userBodyInfo = UserBodyInfo.objects.get(user_id=user.id)
            if height is not None:
                userBodyInfo.height = height
            if weight is not None:    
                userBodyInfo.weight = weight
            if duration is not None:
                userBodyInfo.duration = duration
            if goal is not None:
                userBodyInfo.goal = goal
            if right_arm_muscle_mass != 0:
                userBodyInfo.right_arm_muscle_mass = right_arm_muscle_mass
            if left_arm_muscle_mass != 0:
               userBodyInfo.left_arm_muscle_mass = left_arm_muscle_mass
            if body_muscle_mass != 0:
               userBodyInfo.body_muscle_mass = body_muscle_mass
            if right_leg_muscle_mass != 0:
              userBodyInfo.right_leg_muscle_mass = right_leg_muscle_mass
            if left_leg_muscle_mass != 0:
                userBodyInfo.left_leg_muscle_mass = left_leg_muscle_mass
            userBodyInfo.save()
            response = Response({"success":True})
        except UserBodyInfo.DoesNotExist:
            UserBodyInfo.objects.create(user_id=user, height = height, weight = weight, duration = duration, goal = goal
                                        , right_arm_muscle_mass = right_arm_muscle_mass, left_arm_muscle_mass = left_arm_muscle_mass
                                        , body_muscle_mass = body_muscle_mass, right_leg_muscle_mass = right_leg_muscle_mass
                                        , left_leg_muscle_mass = left_leg_muscle_mass)
            response = Response({"success":True}, status=status.HTTP_201_CREATED)
            
        if needNewPlan:
            newPlan(user)
        
        return response

def newPlan(user):
    muscleMassSet = UserBodyInfo.objects.get(user_id = user.id)
    armsMuscleMass = muscleMassSet.right_arm_muscle_mass + muscleMassSet.left_arm_muscle_mass
    bodyMuscleMass = muscleMassSet.body_muscle_mass
    legsMuscleMass = muscleMassSet.right_leg_muscle_mass + muscleMassSet.left_leg_muscle_mass
    diff1 = bodyMuscleMass - legsMuscleMass
    main = 0
    if 10 <= diff1 <= 20:
        main = 1
    elif diff1 >= 20:
        main = 2
    elif -20 <= diff1 <= -10:
        main = 3
    elif diff1 <= -20:
        main = 4
    
    diff2 = bodyMuscleMass - armsMuscleMass
    add = 0
    if 10 <= diff2 <= 20:
        add = 1  
    
    if user.exercise_main_plan_type != main:
        user.exercise_main_plan_type = main
        user.exercise_main_plan_idx = 0
    if user.exercise_add_plan_type != add:
        user.exercise_add_plan_type = add
        user.exercise_add_plan_idx = 0
    user.save()
    
#get exercise plan
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def exercisePlan(request):
    planDays = 7
    user = request.user
    main = user.exercise_main_plan_type
    add = user.exercise_add_plan_type
    chest_recent = user.chest_recent
    
    #get plan
    mainPlanSet = ExerciseMainPlan.objects.filter(type = main).order_by('day')
    days = len(mainPlanSet)
    mainIdx = user.exercise_main_plan_idx % days
    mainExerciseList = []
    for i in range(0, planDays):
        mainPart = ''
        if mainPlanSet[(mainIdx + i) % days].muscle_part == 'body':
            if chest_recent:
                mainPart = 'back'
            else:
                mainPart = 'chest'
            chest_recent = not chest_recent
        else:
            mainPart = 'legs'
        
        mainExercise_id = UserDefaultExercise.objects.get(user_id = user.id, muscle_part=mainPart).exercise_id.id
        mainExercise = model_to_dict(Exercise.objects.get(id = mainExercise_id))
        mainExerciseList.append(mainExercise)
    
    addPlanSet = ExerciseAddPlan.objects.filter(type = add).order_by('day')
    days = len(addPlanSet)
    addIdx = user.exercise_add_plan_idx % days
    addExerciseList = []
    for i in range(0, planDays):
        addPart = addPlanSet[(addIdx + i) % days].muscle_part
        addExercise_id = UserDefaultExercise.objects.get(user_id = user.id, muscle_part=addPart).exercise_id.id
        addExercise = model_to_dict(Exercise.objects.get(id = addExercise_id))
        addExerciseList.append(addExercise)
    
    #set specific exercise
    
    #return Response({"main":mainExercise, "add":addExercise})
    return Response({"main":mainExerciseList, "add":addExerciseList})

#get, post done exercise
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def doneExercise(request):
    user = request.user
    if request.method == 'GET':
        exercise_list = []
        date_time_list = []
        duration_list = []
        doneExerciseSet = UserExerciseDone.objects.filter(user_id = user.id).values('exercise_id', 'date_time', 'duration')
        for doneExercise in doneExerciseSet:
            #only name
            #exercise_list.append(Exercise.objects.get(id=doneExercise['exercise_id']).name)
            #all info(name, muscle_part, calorie per hour or set, setnum)
            exercise_list.append(model_to_dict(Exercise.objects.get(id=doneExercise['exercise_id'])))
            date_time_list.append(doneExercise['date_time'])
            duration_list.append(doneExercise['duration'])
        return Response({'exercises':exercise_list, 'date_times':date_time_list, 'durations':duration_list})
    elif request.method == 'POST':
        main_exercise_name = request.data.get('main')
        add_exercise_name = request.data.get('add')
        try:
            mainExercise = Exercise.objects.get(name = main_exercise_name)
        except Exercise.DoesNotExist:
            return Response({'error':'wrong main exercise'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            addExercise = Exercise.objects.get(name = add_exercise_name)
        except Exercise.DoesNotExist:
            return Response({'error':'wrong add exercise'}, status=status.HTTP_400_BAD_REQUEST)
        UserExerciseDone.objects.create(user_id = user, exercise_id = mainExercise)
        UserExerciseDone.objects.create(user_id = user, exercise_id = addExercise)
        if mainExercise.muscle_part == 'chest':
            user.chest_recent = True
        elif addExercise.muscle_part == 'back':
            user.chest_recent = False
        user.exercise_main_plan_idx += 1
        user.exercise_add_plan_idx += 1
        user.save()
        return Response({"success":True})