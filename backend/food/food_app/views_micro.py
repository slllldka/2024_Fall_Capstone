from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import *

@api_view(['GET'])
def fiveDayCalorieCount(request):
    user_id = request.query_params.get('id')
    count = FiveDayCalorie.objects.filter(user_id=user_id).count()
    return Response({'calorie_count':count})

@api_view(['GET'])
def fiveDayCalorieList(request):
    user_id = request.query_params.get('id')
    _set = FiveDayCalorie.objects.filter(user_id=user_id).order_by('-date')[:2]
    _list = list(_set.values('calorie', 'date'))
    return Response({'calorie_set': _list})