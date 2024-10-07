from django.shortcuts import render

from rest_framework import viewsets
from .serializers import UserSerializer

from django.contrib.auth import authenticate
from django.contrib.auth.models import User

from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
# Create your views here.


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
@api_view(['POST'])
def signup(request):
    username = request.data.get('username')
    password = request.data.get('password')
    try:
        user = User.objects.create_user(username=username, password=password)
        return Response({'success':True, 'message': 'User created successfully!'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request, username = username, password = password)
    if(user is not None):
        refresh_token = RefreshToken.for_user(user)
        access_token = refresh_token.access_token
        return Response({'success':True, 'access':str(access_token), 'refresh':str(refresh_token)})
    else:
        return Response({'success':False})
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def valid(request):
    return Response({'success':True, 'username':request.user.username})

@api_view(['POST'])
def refresh(request):
    refreshStr = request.data.get('refresh')
    if refreshStr is None:
        return Response({'error':'need refresh token'}, status = 400)
    else:
        try:
            refresh_token = RefreshToken(refreshStr)
            access_token = refresh_token.access_token
            return Response({'access':str(access_token)})
        
        except TokenError:
            Response({'error':'expired refresh token'}, status = 401)
