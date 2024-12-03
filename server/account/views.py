from django.shortcuts import render

from rest_framework import viewsets
from .serializers import UserSerializer

from django.contrib.auth import authenticate
from .models import User
from exercise.models import *

from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from django.forms.models import model_to_dict

from django.utils import timezone
# Create your views here.


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
@api_view(['POST'])
def signup(request):
    email = request.data.get('email')
    password = request.data.get('password')
    first_name = request.data.get('first_name')
    last_name = request.data.get('last_name')
    gender = request.data.get('gender')
    vegan = request.data.get('vegan')
    ###phonenumber = request.data.get('phonenumber')
    try:
        user = User.objects.create_user(email=email, password=password, first_name=first_name,
                                        last_name=last_name, gender=gender, vegan=vegan) ###, phonenumber=phonenumber)
        return Response({'success':True, 'message': 'User created successfully!'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    user = authenticate(request, email = email, password = password)
    if(user is not None):
        refresh_token = RefreshToken.for_user(user)
        access_token = refresh_token.access_token
        user.last_login = timezone.now()
        user.save()
        
        upperchest=UserDefaultUpperChestExercise.objects.filter(user_id=user.id)
        middlechest=UserDefaultMiddleChestExercise.objects.filter(user_id=user.id)
        lowerchest=UserDefaultLowerChestExercise.objects.filter(user_id=user.id)
        back=UserDefaultBackExercise.objects.filter(user_id=user.id)
        frontthigh=UserDefaultFrontThighExercise.objects.filter(user_id=user.id)
        backthigh=UserDefaultBackThighExercise.objects.filter(user_id=user.id)
        biceps=UserDefaultBicepsExercise.objects.filter(user_id=user.id)
        triceps=UserDefaultTricepsExercise.objects.filter(user_id=user.id)
        lateraldeltoid=UserDefaultLateralDeltoidExercise.objects.filter(user_id=user.id)
        anteriordeltoid=UserDefaultAnteriorDeltoidExercise.objects.filter(user_id=user.id)
        posteriordeltoid=UserDefaultPosteriorDeltoidExercise.objects.filter(user_id=user.id)
        abs=UserDefaultAbsExercise.objects.filter(user_id=user.id)
        default_set = Exercise.objects.filter(default=True)
        
        #initialize default exercise
        if upperchest.count() != 1:
            upperchest.delete()
            upperchest_set=default_set.filter(sub_part="upper chest")
            for exercise in upperchest_set:
                UserDefaultUpperChestExercise.objects.create(user_id=user, exercise_id=exercise)
        if middlechest.count() != 2:
            middlechest.delete()
            middlechest_set=default_set.filter(sub_part="middle chest")
            for exercise in middlechest_set:
                UserDefaultMiddleChestExercise.objects.create(user_id=user, exercise_id=exercise)
        if lowerchest.count() != 1:
            lowerchest.delete()
            lowerchest_set=default_set.filter(sub_part="lower chest")
            for exercise in lowerchest_set:
                UserDefaultLowerChestExercise.objects.create(user_id=user, exercise_id=exercise)
        if back.count() != 4:
            back.delete()
            back_set=default_set.filter(sub_part="back")
            for exercise in back_set:
                UserDefaultBackExercise.objects.create(user_id=user, exercise_id=exercise)
        if frontthigh.count() != 2:
            frontthigh.delete()
            frontthigh_set=default_set.filter(sub_part="front thigh")
            for exercise in frontthigh_set:
                UserDefaultFrontThighExercise.objects.create(user_id=user, exercise_id=exercise)
        if backthigh.count() != 2:
            backthigh.delete()
            backthigh_set=default_set.filter(sub_part="back thigh")
            for exercise in backthigh_set:
                UserDefaultBackThighExercise.objects.create(user_id=user, exercise_id=exercise)
        if biceps.count() != 1:
            biceps.delete()
            biceps_set=default_set.filter(sub_part="biceps")
            for exercise in biceps_set:
                UserDefaultBicepsExercise.objects.create(user_id=user, exercise_id=exercise)
        if triceps.count() != 1:
            triceps.delete()
            triceps_set=default_set.filter(sub_part="triceps")
            for exercise in triceps_set:
                UserDefaultTricepsExercise.objects.create(user_id=user, exercise_id=exercise)
        if lateraldeltoid.count() != 1:
            lateraldeltoid.delete()
            lateraldeltoid_set=default_set.filter(sub_part="lateral deltoid")
            for exercise in lateraldeltoid_set:
                UserDefaultLateralDeltoidExercise.objects.create(user_id=user, exercise_id=exercise)
        if anteriordeltoid.count() != 1:
            anteriordeltoid.delete()
            anteriordeltoid_set=default_set.filter(sub_part="anterior deltoid")
            for exercise in anteriordeltoid_set:
                UserDefaultAnteriorDeltoidExercise.objects.create(user_id=user, exercise_id=exercise)
        if posteriordeltoid.count() != 1:
            posteriordeltoid.delete()
            posteriordeltoid_set=default_set.filter(sub_part="posterior deltoid")
            for exercise in posteriordeltoid_set:
                UserDefaultPosteriorDeltoidExercise.objects.create(user_id=user, exercise_id=exercise)
        if abs.count() != 3:
            abs.delete()
            abs_set=default_set.filter(sub_part="abs")
            for exercise in abs_set:
                UserDefaultAbsExercise.objects.create(user_id=user, exercise_id=exercise)
        
        return Response({'success':True, 'id':user.id, 'access':str(access_token), 'refresh':str(refresh_token)
                         , 'registered_allergy':user.registered_allergy})
        
    else:
        return Response(status = status.HTTP_401_UNAUTHORIZED)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def valid(request):
    return Response({'success':True, 'email':request.user.email})

@api_view(['POST'])
def refresh(request):
    refreshStr = request.data.get('refresh')
    if refreshStr is None:
        return Response({'error':'need refresh token'}, status = status.HTTP_400_BAD_REQUEST)
    else:
        try:
            refresh_token = RefreshToken(refreshStr)
            access_token = refresh_token.access_token
            return Response({'access':str(access_token)})
        
        except TokenError:
            Response({'error':'expired refresh token'}, status = status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def myinfo(request):
    return Response(model_to_dict(request.user, fields=['email', 'first_name', 'last_name'
                                                        , 'date_joined', 'last_login', 'gender', 'vegan']))