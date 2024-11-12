from django.shortcuts import render

#from rest_framework import viewsets
#from .serializers import UserSerializer

from django.contrib.auth import authenticate

from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from django.utils import timezone

from django.db import IntegrityError

#from .models import User
from .models import *

# Create your views here.

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def userAllergy(request):
    if request.method == 'GET':
        user_id = request.user.id
        allergy_list = []
        allergy_id_set = UserAllergy.objects.filter(user_id = user_id).values('allergy_id')
        for allergy in allergy_id_set:
            allergy_name = Allergy.objects.filter(id=allergy['allergy_id']).values('name').get()
            allergy_list.append(allergy_name['name'])
        return Response({'success':True, 'allergies':allergy_list})
    
    elif request.method == 'POST':
        user = request.user
        allergy_list = request.data.get('allergies')
        for allergy_name in allergy_list:
            try:
                allergy = Allergy.objects.filter(name=allergy_name).get()
            except Allergy.DoesNotExist:
                return Response({'error':'allergy is wrong'}, status = status.HTTP_400_BAD_REQUEST)
                
            try:
                UserAllergy.objects.create(user_id=user, allergy_id=allergy)
            except IntegrityError:
                return Response({'error':'already exist'}, status = status.HTTP_409_CONFLICT)
        return Response({'success':True})

@api_view(['GET', 'POST'])
def foodKeyword(request):
    if request.method == 'GET':
        food_name = request.query_params.get('food')
        
        try:
            food_id = Food.objects.filter(name=food_name).values('id').get()
        except Food.DoesNotExist:
            return Response({'error':'food is wrong'}, status = status.HTTP_400_BAD_REQUEST)
        food_id = food_id['id']
        
        keyword_list = []
        keyword_set = FoodKeyword.objects.filter(food_id=food_id).values('keyword')
        for keyword in keyword_set:
            keyword_list.append(keyword['keyword'])
        return Response({'success':True, 'keywords':keyword_list})
    
    elif request.method == 'POST':
        food_name = request.data.get('food')
        try:
            food = Food.objects.filter(name=food_name).get()
        except Food.DoesNotExist:
            return Response({'error':'food is wrong'}, status = status.HTTP_400_BAD_REQUEST)
        
        keyword_list = request.data.get('keywords')
        
        if keyword_list is None:
            return Response({'error':'empty keyword'}, status = status.HTTP_400_BAD_REQUEST)
        
        for keyword in keyword_list:
            try:
                FoodKeyword.objects.create(food_id=food, keyword=keyword)
            except IntegrityError:
                return Response({'error':'already exist'}, status = status.HTTP_409_CONFLICT)
        return Response({'success':True})

@api_view(['GET'])
def getIngredientByFood(request):
    food_name = request.query_params.get('food')
    
    try:
        food_id = Food.objects.filter(name=food_name).values('id').get()
    except Food.DoesNotExist:
        return Response({'error':'food is wrong'}, status = status.HTTP_400_BAD_REQUEST)
    food_id = food_id['id']
    
    ingredient_list = []
    ingredient_set = IngredientInFood.objects.filter(food_id=food_id).values('ingredient_id')
    for ingredient in ingredient_set:
        ingredient_name = Ingredient.objects.filter(id=ingredient['ingredient_id']).values('name').get()
        ingredient_list.append(ingredient_name['name'])
    return Response({'success':True, 'ingredients':ingredient_list})

@api_view(['GET'])
def getFoodByIngredient(request):
    ingredient_name = request.query_params.get('ingredient')
    
    try:
        ingredient_id = Ingredient.objects.filter(name=ingredient_name).values('id').get()
    except Food.DoesNotExist:
        return Response({'error':'ingredient is wrong'}, status = status.HTTP_400_BAD_REQUEST)
    ingredient_id = ingredient_id['id']
    
    food_list = []
    food_set = IngredientInFood.objects.filter(ingredient_id=ingredient_id).values('food_id')
    for food in food_set:
        food_name = Food.objects.filter(id=food['food_id']).values('name').get()
        food_list.append(food_name['name'])
    return Response({'success':True, 'foods':food_list})
    

@api_view(['POST'])
def foodIngredient(request):
    food_name = request.data.get('food')
    try:
        food = Food.objects.filter(name=food_name).get()
    except Food.DoesNotExist:
        return Response({'error':'food is wrong'}, status = status.HTTP_400_BAD_REQUEST)
    
    ingredient_list = request.data.get('ingredients')
    
    if ingredient_list is None:
        return Response({'error':'empty ingredient'}, status = status.HTTP_400_BAD_REQUEST)
    
    for ingredient_name in ingredient_list:
        try:
            ingredient = Ingredient.objects.filter(name=ingredient_name).get()
        except Ingredient.DoesNotExist:
            return Response({'error':'ingredient is wrong'}, status = status.HTTP_400_BAD_REQUEST)
        try:
            IngredientInFood.objects.create(food_id=food, ingredient_id=ingredient)
        except IntegrityError:
            return Response({'error':'already exist'}, status = status.HTTP_409_CONFLICT)
    return Response({'success':True})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def checkVegan(request):
    isVegan = request.user.vegan
    if not isVegan:
        return Response({'vegan':isVegan})
    else:
        vegan_food_list = []
        vegan_food_set = Food.objects.filter(vegan = isVegan).values('name')
        for vegan_food_name in vegan_food_set:
            vegan_food_list.append(vegan_food_name['name'])
        return Response({'vegan':isVegan, 'foods':vegan_food_list})
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def foodText(request):
    text = request.data.get('text')
    #TODO
    return Response({'text':text, 'foods':['list', 'of', 'foods']})

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def fridgeImage(request):
    if request.method == 'GET':
        user_id = request.user.id
        try:
            image = UserFridgeImage.objects.filter(user_id=user_id).values('base64image').get()
        except UserFridgeImage.DoesNotExist:
            return Response({'error':'fridge image does not exist'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'image':image['base64image']})
    elif request.method == 'POST':
        user = request.user
        image = request.data.get('image')
        try:
            userImage = UserFridgeImage.objects.get(user_id=user.id)
            userImage.base64image = image
            userImage.save()
        except UserFridgeImage.DoesNotExist:
            UserFridgeImage.objects.create(user_id=user, base64image=image)
        
        return Response({'success':True})