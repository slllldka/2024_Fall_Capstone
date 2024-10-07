from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .serializers import *

class UserList(APIView):
    
    def get(self, request):
        model = User.objects.all()
        serializer = UserSerializer(model, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = status.HTTP_201_CREATED)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)

class UserID(APIView):
    
    def get(self, request, id):
        model = User.objects.get(id = id)
        serializer = UserSerializer(model)
        return Response(serializer.data)
    
    def put(self, request, name):
        model = User.objects.get(name = name)
        serializer = UserSerializer(model, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, id):
        model = User.objects.get(id = id)
        model.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)