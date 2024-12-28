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

#check default exercise
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def checkDefaultExercise(request):
    user_id = request.user.id
    upperchest=UserDefaultUpperChestExercise.objects.filter(user_id=user_id)
    middlechest=UserDefaultMiddleChestExercise.objects.filter(user_id=user_id)
    lowerchest=UserDefaultLowerChestExercise.objects.filter(user_id=user_id)
    back=UserDefaultBackExercise.objects.filter(user_id=user_id)
    frontthigh=UserDefaultFrontThighExercise.objects.filter(user_id=user_id)
    backthigh=UserDefaultBackThighExercise.objects.filter(user_id=user_id)
    biceps=UserDefaultBicepsExercise.objects.filter(user_id=user_id)
    triceps=UserDefaultTricepsExercise.objects.filter(user_id=user_id)
    lateraldeltoid=UserDefaultLateralDeltoidExercise.objects.filter(user_id=user_id)
    anteriordeltoid=UserDefaultAnteriorDeltoidExercise.objects.filter(user_id=user_id)
    posteriordeltoid=UserDefaultPosteriorDeltoidExercise.objects.filter(user_id=user_id)
    abs=UserDefaultAbsExercise.objects.filter(user_id=user_id)
    default_set = Exercise.objects.filter(default=True)
    
    #initialize default exercise
    if upperchest.count() != 1:
        upperchest.delete()
        upperchest_set=default_set.filter(sub_part="upper chest")
        for exercise in upperchest_set:
            UserDefaultUpperChestExercise.objects.create(user_id=user_id, exercise_id=exercise)
    if middlechest.count() != 2:
        middlechest.delete()
        middlechest_set=default_set.filter(sub_part="middle chest")
        for exercise in middlechest_set:
            UserDefaultMiddleChestExercise.objects.create(user_id=user_id, exercise_id=exercise)
    if lowerchest.count() != 1:
        lowerchest.delete()
        lowerchest_set=default_set.filter(sub_part="lower chest")
        for exercise in lowerchest_set:
            UserDefaultLowerChestExercise.objects.create(user_id=user_id, exercise_id=exercise)
    if back.count() != 4:
        back.delete()
        back_set=default_set.filter(sub_part="back")
        for exercise in back_set:
            UserDefaultBackExercise.objects.create(user_id=user_id, exercise_id=exercise)
    if frontthigh.count() != 2:
        frontthigh.delete()
        frontthigh_set=default_set.filter(sub_part="front thigh")
        for exercise in frontthigh_set:
            UserDefaultFrontThighExercise.objects.create(user_id=user_id, exercise_id=exercise)
    if backthigh.count() != 2:
        backthigh.delete()
        backthigh_set=default_set.filter(sub_part="back thigh")
        for exercise in backthigh_set:
            UserDefaultBackThighExercise.objects.create(user_id=user_id, exercise_id=exercise)
    if biceps.count() != 1:
        biceps.delete()
        biceps_set=default_set.filter(sub_part="biceps")
        for exercise in biceps_set:
            UserDefaultBicepsExercise.objects.create(user_id=user_id, exercise_id=exercise)
    if triceps.count() != 1:
        triceps.delete()
        triceps_set=default_set.filter(sub_part="triceps")
        for exercise in triceps_set:
            UserDefaultTricepsExercise.objects.create(user_id=user_id, exercise_id=exercise)
    if lateraldeltoid.count() != 1:
        lateraldeltoid.delete()
        lateraldeltoid_set=default_set.filter(sub_part="lateral deltoid")
        for exercise in lateraldeltoid_set:
            UserDefaultLateralDeltoidExercise.objects.create(user_id=user_id, exercise_id=exercise)
    if anteriordeltoid.count() != 1:
        anteriordeltoid.delete()
        anteriordeltoid_set=default_set.filter(sub_part="anterior deltoid")
        for exercise in anteriordeltoid_set:
            UserDefaultAnteriorDeltoidExercise.objects.create(user_id=user_id, exercise_id=exercise)
    if posteriordeltoid.count() != 1:
        posteriordeltoid.delete()
        posteriordeltoid_set=default_set.filter(sub_part="posterior deltoid")
        for exercise in posteriordeltoid_set:
            UserDefaultPosteriorDeltoidExercise.objects.create(user_id=user_id, exercise_id=exercise)
    if abs.count() != 3:
        abs.delete()
        abs_set=default_set.filter(sub_part="abs")
        for exercise in abs_set:
            UserDefaultAbsExercise.objects.create(user_id=user_id, exercise_id=exercise)
    
    return Response({"success":True})
    
#get, post bodyinfo
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def bodyInfo(request):
    user = request.user
    if request.method == 'GET':
        try:
            userBodyInfo = UserBodyInfo.objects.get(user_id = user.id)
        except UserBodyInfo.DoesNotExist:
            userBodyInfo = UserBodyInfo.objects.create(user_id = user)
        return Response(model_to_dict(userBodyInfo, fields=['height', 'duration', 'goal']))
    elif request.method == 'POST':
        try:
            userBodyInfo = UserBodyInfo.objects.get(user_id = user.id)
        except UserBodyInfo.DoesNotExist:
            userBodyInfo = UserBodyInfo.objects.create(user_id = user)
        height = request.data.get('height')
        duration = request.data.get('duration')
        goal = request.data.get('goal')
        
        if height is not None:
            userBodyInfo.height = height
        if duration is not None:
            userBodyInfo.duration = duration
        if goal is not None:
            userBodyInfo.goal = goal
        userBodyInfo.save()
        
        return Response({"success":True})
#get, post weight
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def weight(request):
    user = request.user
    if request.method == 'GET':
        userWeightSet = UserWeight.objects.filter(user_id = user.id).order_by('-date')[:30]
        userWeightList = []
        for userWeight in userWeightSet:
            userWeightList.append(model_to_dict(userWeight, fields=['date', 'weight']))
        return Response({'weights':userWeightList})
    elif request.method == 'POST':
        weight = request.data.get('weight')
        
        if weight is None:
            return Response({'error':'missing weight'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            UserWeight.objects.create(user_id = user, weight = weight)
            #TODO api 호출
        except IntegrityError:
            return Response({'error':'only once a day'}, status=status.HTTP_409_CONFLICT)
        return Response({'success':True}, status=status.HTTP_201_CREATED)
    
#get, post muscle
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def muscle(request):
    user = request.user
    if request.method == 'GET':
        userMuscleSet = UserMuscle.objects.filter(user_id = user.id).order_by('-date')[:30]
        if len(userMuscleSet) == 0:
            return Response({"error":"muscle does not exist"}, status = status.HTTP_404_NOT_FOUND)
        userMuscleList = []
        for userMuscle in userMuscleSet:
            userMuscleList.append(model_to_dict(userMuscle
                                                , fields=['date', 'right_arm_muscle_mass', 'left_arm_muscle_mass'
                                                          , 'body_muscle_mass', 'right_leg_muscle_mass'
                                                          , 'left_leg_muscle_mass']))
        return Response({'muscles':userMuscleList})
    elif request.method == 'POST':
        right_arm_muscle_mass = request.data.get('right_arm_muscle_mass')
        left_arm_muscle_mass = request.data.get('left_arm_muscle_mass')
        body_muscle_mass = request.data.get('body_muscle_mass')
        right_leg_muscle_mass = request.data.get('right_leg_muscle_mass')
        left_leg_muscle_mass = request.data.get('left_leg_muscle_mass')
        
        if right_arm_muscle_mass is None:
            return Response({'error':'missing right_arm_muscle_mass'}, status=status.HTTP_400_BAD_REQUEST)
        elif left_arm_muscle_mass is None:
            return Response({'error':'missing left_arm_muscle_mass'}, status=status.HTTP_400_BAD_REQUEST)
        elif body_muscle_mass is None:
            return Response({'error':'missing body_muscle_mass'}, status=status.HTTP_400_BAD_REQUEST)
        elif right_leg_muscle_mass is None:
            return Response({'error':'missing right_leg_muscle_mass'}, status=status.HTTP_400_BAD_REQUEST)
        elif left_leg_muscle_mass is None:
            return Response({'error':'missing left_leg_muscle_mass'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            UserMuscle.objects.create(user_id = user, right_arm_muscle_mass=right_arm_muscle_mass, left_arm_muscle_mass=left_arm_muscle_mass
                                    , body_muscle_mass=body_muscle_mass, right_leg_muscle_mass=right_leg_muscle_mass
                                    , left_leg_muscle_mass=left_leg_muscle_mass)
        except IntegrityError:
            return Response({'error':'only once a day'}, status=status.HTTP_409_CONFLICT)
        
        newPlan(user)
        return Response({'success':True}, status=status.HTTP_201_CREATED)
        
'''    
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def bodyMetrics(request):
    user = request.user
    if request.method == 'GET':
        try:
            userBodyInfo = UserBodyInfo.objects.get(user_id = user.id)
        except UserBodyInfo.DoesNotExist:
            UserBodyInfo.objects.create(user_id = user)
        try:
            userWeightSet = UserWeight.objects.filter(user_id = user.id)[:10]
        except UserWeight.DoesNotExist:
            UserWeight.objects.create(user_id = user)
        try:
            userBodyInfoSet = UserMuscle.objects.filter(user_id = user.id)[:10]
        except UserMuscle.DoesNotExist:
            UserMuscle.objects.create(user_id = user)
        userBodyInfoList = []
        for userBodyInfo in userBodyInfoSet:
            userBodyInfoList.append(model_to_dict(userBodyInfo
                                      , fields=['height', 'weight', 'duration', 'goal', 'right_arm_muscle_mass', 'left_arm_muscle_mass'
                                                , 'body_muscle_mass', 'right_leg_muscle_mass', 'left_leg_muscle_mass', 'date_time']))
        return Response({"bodyinfos":userBodyInfoList})
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
'''

def newPlan(user):
    muscleMassSet = UserMuscle.objects.get(user_id = user.id)
    armsMuscleMass = (muscleMassSet.right_arm_muscle_mass + muscleMassSet.left_arm_muscle_mass)/2
    bodyMuscleMass = muscleMassSet.body_muscle_mass
    legsMuscleMass = (muscleMassSet.right_leg_muscle_mass + muscleMassSet.left_leg_muscle_mass)/2
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
    planDays = 1
    user = request.user
    main = user.exercise_main_plan_type
    add = user.exercise_add_plan_type
    chest_recent = user.chest_recent
    
    #get plan
    mainPlanSet = ExerciseMainPlan.objects.filter(type = main).order_by('day')
    days = len(mainPlanSet)
    today_main_done = isTodayMainDone(user)
    mainIdx = user.exercise_main_plan_idx
    if today_main_done:
        mainIdx -= 1
    mainIdx %= days
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
        
        if today_main_done:
            if mainPart == 'chest':
                mainPart = 'back'
            elif mainPart == 'back':
                mainPart = 'chest'
        
        if mainPart == 'chest':
            #upper chest
            upperchest_set=UserDefaultUpperChestExercise.objects.filter(user_id=user.id)
            for exercise in upperchest_set:
                mainExerciseList.append(model_to_dict(exercise.exercise_id))
            #middle chest
            middlechest_set=UserDefaultMiddleChestExercise.objects.filter(user_id=user.id)
            for exercise in middlechest_set:
                mainExerciseList.append(model_to_dict(exercise.exercise_id))
            #lower chest
            lowerchest_set=UserDefaultLowerChestExercise.objects.filter(user_id=user.id)
            for exercise in lowerchest_set:
                mainExerciseList.append(model_to_dict(exercise.exercise_id))
        elif mainPart == 'back':
            #back
            back_set=UserDefaultBackExercise.objects.filter(user_id=user.id)
            for exercise in back_set:
                mainExerciseList.append(model_to_dict(exercise.exercise_id))
        elif mainPart == 'legs':
            #front thigh
            frontthigh_set=UserDefaultFrontThighExercise.objects.filter(user_id=user.id)
            for exercise in frontthigh_set:
                mainExerciseList.append(model_to_dict(exercise.exercise_id))
            #back thigh
            backthigh_set=UserDefaultBackThighExercise.objects.filter(user_id=user.id)
            for exercise in backthigh_set:
                mainExerciseList.append(model_to_dict(exercise.exercise_id))
    
    addPlanSet = ExerciseAddPlan.objects.filter(type = add).order_by('day')
    days = len(addPlanSet)
    addIdx = user.exercise_add_plan_idx
    if isTodayAddDone(user):
        addIdx -= 1
    addIdx %= days
    addExerciseList = []
    for i in range(0, planDays):
        addPart = addPlanSet[(addIdx + i) % days].muscle_part
        if addPart=='arms':
            #biceps
            biceps_set=UserDefaultBicepsExercise.objects.filter(user_id=user.id)
            for exercise in biceps_set:
                addExerciseList.append(model_to_dict(exercise.exercise_id))
            #triceps
            triceps_set=UserDefaultTricepsExercise.objects.filter(user_id=user.id)
            for exercise in triceps_set:
                addExerciseList.append(model_to_dict(exercise.exercise_id))
        elif addPart=='shoulders':
            #lateral deltoid
            lateraldeltoid_set=UserDefaultLateralDeltoidExercise.objects.filter(user_id=user.id)
            for exercise in lateraldeltoid_set:
                addExerciseList.append(model_to_dict(exercise.exercise_id))
            #anterior deltoid
            anteriordeltoid_set=UserDefaultAnteriorDeltoidExercise.objects.filter(user_id=user.id)
            for exercise in anteriordeltoid_set:
                addExerciseList.append(model_to_dict(exercise.exercise_id))
            #posterior deltoid
            posteriordeltoid_set=UserDefaultPosteriorDeltoidExercise.objects.filter(user_id=user.id)
            for exercise in posteriordeltoid_set:
                addExerciseList.append(model_to_dict(exercise.exercise_id))
        elif addPart=='abs':
            #abs
            abs_set=UserDefaultAbsExercise.objects.filter(user_id=user.id)
            for exercise in abs_set:
                addExerciseList.append(model_to_dict(exercise.exercise_id))
                
    return Response({"main":mainExerciseList, "add":addExerciseList})

#change default exercise
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def editDefaultExercise(request):
    user = request.user
    upper_chest = request.data.get('upper_chest')
    middle_chest = request.data.get('middle_chest')
    lower_chest = request.data.get('lower_chest')
    back = request.data.get('back')
    front_thigh = request.data.get('front_thigh')
    back_thigh = request.data.get('back_thigh')
    biceps = request.data.get('biceps')
    triceps = request.data.get('triceps')
    lateral_deltoid = request.data.get('lateral_deltoid')
    anterior_deltoid = request.data.get('anterior_deltoid')
    posterior_deltoid = request.data.get('posterior_deltoid')
    abs = request.data.get('abs')
    
    if upper_chest is not None:
        UserDefaultUpperChestExercise.objects.filter(user_id=user.id).delete()
        for exercise_name in upper_chest:
            exercise = Exercise.objects.get(name=exercise_name)
            UserDefaultUpperChestExercise.objects.create(user_id=user, exercise_id=exercise)
    if middle_chest is not None:
        UserDefaultMiddleChestExercise.objects.filter(user_id=user.id).delete()
        for exercise_name in middle_chest:
            exercise = Exercise.objects.get(name=exercise_name)
            UserDefaultMiddleChestExercise.objects.create(user_id=user, exercise_id=exercise)
    if lower_chest is not None:
        UserDefaultLowerChestExercise.objects.filter(user_id=user.id).delete()
        for exercise_name in lower_chest:
            exercise = Exercise.objects.get(name=exercise_name)
            UserDefaultLowerChestExercise.objects.create(user_id=user, exercise_id=exercise)
    if back is not None:
        UserDefaultBackExercise.objects.filter(user_id=user.id).delete()
        for exercise_name in back:
            exercise = Exercise.objects.get(name=exercise_name)
            UserDefaultBackExercise.objects.create(user_id=user, exercise_id=exercise)
    if front_thigh is not None:
        UserDefaultFrontThighExercise.objects.filter(user_id=user.id).delete()
        for exercise_name in front_thigh:
            exercise = Exercise.objects.get(name=exercise_name)
            UserDefaultFrontThighExercise.objects.create(user_id=user, exercise_id=exercise)
    if back_thigh is not None:
        UserDefaultBackThighExercise.objects.filter(user_id=user.id).delete()
        for exercise_name in back_thigh:
            exercise = Exercise.objects.get(name=exercise_name)
            UserDefaultBackThighExercise.objects.create(user_id=user, exercise_id=exercise)
    if biceps is not None:
        UserDefaultBicepsExercise.objects.filter(user_id=user.id).delete()
        for exercise_name in biceps:
            exercise = Exercise.objects.get(name=exercise_name)
            UserDefaultBicepsExercise.objects.create(user_id=user, exercise_id=exercise)
    if triceps is not None:
        UserDefaultTricepsExercise.objects.filter(user_id=user.id).delete()
        for exercise_name in triceps:
            exercise = Exercise.objects.get(name=exercise_name)
            UserDefaultTricepsExercise.objects.create(user_id=user, exercise_id=exercise)
    if lateral_deltoid is not None:
        UserDefaultLateralDeltoidExercise.objects.filter(user_id=user.id).delete()
        for exercise_name in lateral_deltoid:
            exercise = Exercise.objects.get(name=exercise_name)
            UserDefaultLateralDeltoidExercise.objects.create(user_id=user, exercise_id=exercise)
    if anterior_deltoid is not None:
        UserDefaultAnteriorDeltoidExercise.objects.filter(user_id=user.id).delete()
        for exercise_name in anterior_deltoid:
            exercise = Exercise.objects.get(name=exercise_name)
            UserDefaultAnteriorDeltoidExercise.objects.create(user_id=user, exercise_id=exercise)
    if posterior_deltoid is not None:
        UserDefaultPosteriorDeltoidExercise.objects.filter(user_id=user.id).delete()
        for exercise_name in posterior_deltoid:
            exercise = Exercise.objects.get(name=exercise_name)
            UserDefaultPosteriorDeltoidExercise.objects.create(user_id=user, exercise_id=exercise)
    if abs is not None:
        UserDefaultAbsExercise.objects.filter(user_id=user.id).delete()
        for exercise_name in abs:
            exercise = Exercise.objects.get(name=exercise_name)
            UserDefaultAbsExercise.objects.create(user_id=user, exercise_id=exercise)
    
    return Response({'success':True})

#get, post done exercise
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def doneExercise(request):
    user = request.user
    if request.method == 'GET':
        exercise_list = []
        date_list = []
        duration_list = []
        doneExerciseSet = UserExerciseDone.objects.filter(user_id = user.id).values('exercise_id', 'date', 'duration')
        for doneExercise in doneExerciseSet:
            #only name
            #exercise_list.append(Exercise.objects.get(id=doneExercise['exercise_id']).name)
            #all info(name, muscle_part, calorie per hour or set, setnum)
            exercise_list.append(model_to_dict(Exercise.objects.get(id=doneExercise['exercise_id'])))
            date_list.append(doneExercise['date'])
            duration_list.append(doneExercise['duration'])
        return Response({'exercises':exercise_list, 'dates':date_list, 'durations':duration_list})
    elif request.method == 'POST':
        main_exercise_name = request.data.get('main')
        add_exercise_name = request.data.get('add')
        
        if main_exercise_name is not None:
            try:
                mainExercise = Exercise.objects.get(name=main_exercise_name)
            except Exercise.DoesNotExist:
                return Response({'error':'wrong main exercise'}, status=status.HTTP_400_BAD_REQUEST)
            if mainExercise.muscle_part == 'chest':
                user.chest_recent = True
            elif mainExercise.muscle_part == 'back':
                user.chest_recent = False
            
            try:
                increase = not isTodayMainDone(user)
                if increase:
                    user.exercise_main_plan_idx += 1
                UserExerciseDone.objects.create(user_id=user, exercise_id=mainExercise)
            except IntegrityError:
                print("fuck")
                if increase:
                    user.exercise_main_plan_idx -= 1
        if add_exercise_name is not None:
            try:
                addExercise = Exercise.objects.get(name=add_exercise_name)
            except Exercise.DoesNotExist:
                return Response({'error':'wrong add exercise'}, status=status.HTTP_400_BAD_REQUEST)
            try:
                increase = not isTodayAddDone(user)
                if increase:
                    user.exercise_add_plan_idx += 1
                UserExerciseDone.objects.create(user_id=user, exercise_id=addExercise)
            except IntegrityError:
                print("fuck")
                if increase:
                    user.exercise_main_plan_idx -= 1
                    
        user.save()
        return Response({"success":True})
    
def isTodayMainDone(user):
    today_set = UserExerciseDone.objects.filter(user_id=user.id, date=timezone.localdate())
    for done_exercise in today_set:
        exercise = done_exercise.exercise_id
        muscle_part = exercise.muscle_part
        if muscle_part == 'chest' or muscle_part == 'back' or muscle_part == 'legs':
            return True
    return False

def isTodayAddDone(user):
    today_set = UserExerciseDone.objects.filter(user_id=user.id, date=timezone.localdate())
    for done_exercise in today_set:
        exercise = done_exercise.exercise_id
        muscle_part = exercise.muscle_part
        if muscle_part == 'arms' or muscle_part == 'shoulders' or muscle_part == 'abs':
            return True
    return False