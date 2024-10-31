from django.shortcuts import render

from rest_framework import viewsets
from .serializers import UserSerializer

from django.contrib.auth import authenticate
from .models import User

from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

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
        return Response({'success':True, 'id':user.id, 'access':str(access_token), 'refresh':str(refresh_token)})
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
