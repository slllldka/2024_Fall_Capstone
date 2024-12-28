from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
import requests

# Create your views here.

class ResponseException(Exception):
    def __init__(self, response):
        self.response = response

def authenticate(access_token):
    url = 'http://127.0.0.1:8000/account/valid'
    headers = {'Authorization': 'Bearer ' + access_token}
    response = requests.post(url, headers=headers)
    if response.status_code != 200:
        raise ResponseException(response)
    return response.json().get('user')

def getFiveDayCalorieCount(user_id):
    url = 'http://127.0.0.1:8002/food/five_day_calorie_count'
    response = requests.get(url, params={'user_id':user_id})
    if response.status_code == 200:
        return response.json().get('calorie_count')
    else:
        raise ResponseException(response)

def getFiveDayCalorieList(user_id):
    url = 'http://127.0.0.1:8002/food/five_day_calorie_list'
    response = requests.get(url, params={'user_id':user_id})
    if response.status_code == 200:
        return response.json().get('calorie_set')
    else:
        raise ResponseException(response)
        
    
def getWeightCount(user_id):
    url = 'http://127.0.0.1:8001/exercise/weight_count'
    response = requests.get(url, params={'user_id':user_id})
    if response.status_code == 200:
        return response.json().get('weight_count')
    else:
        raise ResponseException(response)
    
def getWeightList(user_id):
    url = 'http://127.0.0.1:8001/exercise/weight_list'
    response = requests.get(url, params={'user_id':user_id})
    if response.status_code == 200:
        return response.json().get('weight_set')
    else:
        raise ResponseException(response)

def getFiveDayExerciseCalorie(user_id, gender, date):
    url = 'http://127.0.0.1:8001/exercise/five_day_exercise_calorie'
    response = requests.get(url, params={'user_id':user_id, 'gender':gender, 'date':date})
    if response.status_code == 200:
        return response.json().get('calorie')
    else:
        raise ResponseException(response)

def patchUser(user_id, calorie_bound, calorie_bound_num):
    url = 'http://127.0.0.1:8000/account/user/id/' + str(user_id)
    data = {'calorie_bound':calorie_bound, 'calorie_bound_num':calorie_bound_num}
    response = requests.post(url, data=data)
    return response

@api_view(['GET'])
def calorie_bound(request):
    header = request.headers.get('Authorization')
    if header is None:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    header_parts = header.split()
    if len(header_parts) > 1:
        access_token = header.split()[1]
    else:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        user = authenticate(access_token)
    except ResponseException as e:
        return e.response
    
    try:
        fiveDayCalorieCount = getFiveDayCalorieCount(user['id'])
        weightCount = getWeightCount(user['id'])
    except ResponseException as e:
        return e.response
        
    if  fiveDayCalorieCount >= 2 and (fiveDayCalorieCount + 1 == weightCount):
        try:
            fiveDayCalorieList = getFiveDayCalorieList(user['id'])
            weightList = getWeightList(user['id'])
        except ResponseException as e:
            return e.response
            
        calorie1 = fiveDayCalorieList[0]
        calorie2 = fiveDayCalorieList[1]
        
        try:
            exerciseCalorie1 = getFiveDayExerciseCalorie(user['id'], user['gender'], calorie1['date'])
            exerciseCalorie2 = getFiveDayExerciseCalorie(user['id'], user['gender'], calorie2['date'])
        except ResponseException as e:
            return e.response
        
        net_calorie1 = calorie1 - exerciseCalorie1
        net_calorie2 = calorie2 - exerciseCalorie2
        deltaCalorie = net_calorie1-net_calorie2
        
        
        weightChange1 = weightList[0]['weight'] - weightList[1]['weight']
        weightChange2 = weightList[1]['weight'] - weightList[2]['weight']
        deltaWeightChange = weightChange1-weightChange2
        
        if deltaCalorie * deltaWeightChange > 0:
            ans = net_calorie1 - (deltaCalorie/deltaWeightChange) * weightChange1
            calorie_bound_for_five_days = (user['calorie_bound'] * 5 * user['calorie_bound_num'] + ans) / (user['calorie_bound_num'] + 1)
            calorie_bound = calorie_bound_for_five_days / 5
            calorie_bound_num = user['calorie_bound_num'] + 1
            patchUser(user['id'], calorie_bound, calorie_bound_num)
            
    return Response(status=status.HTTP_200_OK)
