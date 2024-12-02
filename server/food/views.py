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
from django.db.models import Sum

import pandas as pd
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk import pos_tag
import string
import spacy
from collections import Counter
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
from sklearn.metrics.pairwise import cosine_similarity

#from .models import User
from .models import *

import os

# Create your views here.

nlp = spacy.load("en_core_web_sm")
keyword_list = ['eggplant', 'mildness', 'cut', 'gamjajeon', 'Janchi Guksu', 'chashu', 'shallot', 'content', 'Mozzarella', 'Spring Rolls', 'rakkyo', 'Galbi', 'tangsuyuk', 'appetizer', 'wrapping', 'ponzu', 'Kimchi', 'Octopus', 'tallow', 'Tonkatsu', 'sweetness', 'cheddar', 'garlic', 'godeungeo', 'food', 'Katsudon', 'block', 'spring', 'panko', 'paper', 'kombu', 'ssamjang', 'sesame', 'absorbing', 'eater', 'person', 'liquid', 'ham', 'lemon', 'samgyetang', 'another year in age', 'retains', 'pizza', 'fruit', 'ice', 'chewy', 'tartar', 'bit', 'Shabu', 'jjim', 'kimbap', 'Dumpling Soup', 'Ojingeo Bokkeum', 'Tomato Pasta', 'deopbap', 'Samgyeopsal Rice Bowl', 'vinaigrette', 'pork', 'selection', 'pot', 'Beef Brisket', 'Curry Rice', 'buttery', 'the hot summer months', 'bokkeum', 'barbecue', 'Doenjang Jjigae', 'Bibim Naengmyeon', 'sea', 'fiery', 'thai', 'richness', 'mozzarella', 'Cutlet', 'color', 'bread', 'spine', 'item', 'Sundubu Jjigae', 'yolk', 'blood', 'tenderloin', 'meld', 'ranch', 'Pork Bowl', 'Jjajangbap', 'onion', 'briny', 'offer', 'Army Stew', 'infuses', 'seaweed', 'Offal Hot Pot', 'Galbi Jjim', 'goma', 'tanginess', 'cabbage', 'dough', 'powder', 'bun', 'street', 'motsunabe', 'aglio', 'extract', 'Chinese', 'war', 'cake', 'icy', 'Braised Chicken', 'prawn', 'format', 'tender', 'nut', 'leafy', 'cold', 'katsudon', 'Bibim Guksu*', 'sourness', 'absorbs', 'Gamjatang', 'Braised Short Ribs', 'clam', 'sandwich', 'basil', 'jjimdak', 'bean', 'ramen', 'Samgyetang', 'janchi', 'bonito', 'cleanser', 'cuốn', 'infusing', 'Fish Cake Soup', 'water', 'velvety', 'beef', 'carrot', 'Beef Intestines', 'specialty', 'energy', 'protein', 'thickens', 'shoyu', 'dumpling', 'chilly days', 'bibimbap', 'cream', 'budae', 'bulgogi', 'roux', 'salmon', 'first', 'soup', 'Caesar', 'freshness', 'oregano', 'gochugaru', 'spam', 'beer', 'daikon', 'peppercorn', 'mix', 'tangy', 'perilla', 'Chashu Don', 'brown', 'broth', 'Garlic', 'eating', 'touch', 'nigiri', 'Roe', 'Dakgalbi', 'Bean Sprout Soup', 'Seolleongtang', 'stick', 'parsley', 'shichimi togarashi', 'soybean', 'Worcestershire', 'dog', 'lighter', 'character', 'Pork Bone Soup', 'starchy', 'sprinkle', 'strip', 'outer', 'kimchi', 'Parmesan', 'crispy', 'vegetable', 'crispiness', 'the summer months', 'juice', 'mayonnaise', 'stock', 'temperature', 'seafood', 'Don', 'ketchup', 'leaf', 'japchae', 'Black Bean Sauce', 'Spicy Cold Noodles', 'enhances', 'Tempura Rice Bowl', 'simple', 'end', 'tempura', 'enjoyed', 'resilience', 'Nakji Bokkeum*', 'avocado', 'mayo', 'gooey', 'Cold Raw Fish Soup', 'brisket', 'note', 'Rice Bowl', 'melt', 'grain', 'cucumber', 'array', 'herb', 'breadcrumb', 'brings', 'Rice Cake Soup', 'spinach', 'lettuce', 'Spicy Seafood Noodles', 'pickle', 'hint', 'Sichuan', 'soy', 'turkey', 'panini', 'twist', 'bibim', 'indulgent', 'Japchaebap', 'Korean', 'doenjang', 'combine', 'hoisin', 'age', 'colder', 'roll', 'worldwide', 'neck', 'guksu', 'shine', 'version', 'ginseng', 'zucchini', 'Boiled Pork Slices', 'Oil Pasta', 'jjamppong', 'snack', 'Black Bean Noodles', 'flour', 'odeng', 'American', 'gỏi', 'jeyuk', 'mixture', 'chili', 'splash', 'Beef', 'Ginseng Chicken Soup', 'earthy', 'brininess', 'Jeyuk Deopbap', 'aroma', 'corn', 'cheese', 'weather', 'lime', 'tasty', 'parmesan', 'form', 'balancing', 'jujubes', 'colorful', 'elegance', 'gaminess', 'grill', 'tomato', 'army', 'mapo', 'sichuan', 'Layered Hot Pot', 'Ikura Don*', 'skirt', 'jjajangbap', 'level', 'cumin', 'vermicelli noodles', 'Sashimi', 'Pork Cutlet', 'vinegar', 'worcestershire', 'mustard', 'Odeng Tang', 'dashi', 'Mapo Tofu', 'Rice', 'Clam Knife-Cut Noodles', 'tonkatsu', 'nuttiness', 'months', 'iron', 'chunjang', 'wheat', 'chấm', 'kelp', 'tuna', 'jjigae', 'sake', 'raw', 'squid', 'wrap', 'shoga', 'turn', 'seolleongtang', 'tofu', 'loin', 'Margherita', 'wasabi', 'complement', 'Kimchi Jjigae', 'include', 'lends', 'dakgalbi', 'spice', 'Korea', 'luck', 'bell pepper', 'Gyudon', 'spicy', 'Vietnamese', 'pancake', 'tteokguk', 'fish', 'banquet', 'stomach', 'stew', 'beaten', 'mala', 'tilapia', 'depth', 'spiciness', 'palate', 'seven', 'gochujang', 'lock', 'Tteokbokki', 'buckwheat', 'Tangsuyuk', 'butter', 'gukbap', 'rib', 'chewiness', 'cod', 'coat', 'Tteokguk', 'colder days', 'release', 'Suyuk', 'egg', 'burger', 'arrangement', 'cook', 'starch', 'orange', 'kare', 'deeply', 'Classic', 'breast', 'curry', 'Chicken Feet', 'roe', 'sujebi', 'mignon', 'drizzle', 'Soft Tofu Stew', 'chop', 'contribute', 'crisp', 'hearty', 'acidity', 'squeeze', 'chunk', 'dash', 'Sujebi', 'mussel', 'Mul Naengmyeon', 'Dough Soup', 'ginkgo', 'yellowtail', 'vermicelli', 'Japanese', 'snapper', 'cuisine', 'ginger', 'delicate', 'suyuk', 'shrimp', 'tendon', 'nori', 'Pork Cutlet Bowl', 'center', 'fusion', 'seed', 'jjajangmyeon', 'miso', 'shell', 'Godeungeo Jorim', 'potato', 'patty', 'gamjatang', 'crab', 'mild', 'mint', 'broths', 'dollop', 'sausage', 'arugula', 'render', 'creaminess', 'sauce', 'skin', 'Maillard', 'cold days', 'jjajang', 'webfoot', 'Diners', 'Cold Noodles', 'Suyuk Gukbap', 'Ramen', 'syrup', 'custardy', 'scallion', 'strand', 'Broth', 'Fish Cutlet', 'medley', 'appeal', 'Mulhoe', 'warmth', 'pepperoni', 'everything', 'subtle', 'Mixed Rice', 'teriyaki', 'ikura', 'club', 'sprout', 'sundubu', 'five', 'Jeyuk Bokkeum', 'konjac', 'gyudon', 'endless', 'year', 'highlight', 'naengmyeon', 'jorim', 'sharing', 'pan', 'salty', 'crunchy', 'Jjamppong', 'remains', 'tang', 'mulhoe', 'sushi', 'sensation', 'Jjajangmyeon', 'Cream Pasta', 'Japan', 'smoky', 'galbi', 'refreshing', 'mushroom', 'flake', 'creamy', 'Sukiyaki', 'cilantro', 'add', 'chilies', 'japan', 'light', 'sugar', 'sheet', 'doubanjiang', 'crispy tempura', 'shirataki', 'mirin', 'caesar', 'Sweet', 'scallop', 'bajirak', 'duck', 'Banquet Noodles', 'mackerel', 'sundae', 'Salmon Rice Bowl', 'Spicy Pork Rice Bowl', 'pear', 'kick', 'oil', 'offal', 'numbing', 'day', 'Indian', 'coleslaw', 'cooking', 'nabe', 'tteokbokki', 'Kimchi Stew', 'burst', 'honey', 'japchaebap', 'foot', 'Mille', 'tonkotsu', 'Spicy Stir', 'Korean-Chinese', 'chestnut', 'sashimi', 'tentsuyu', 'octopus', 'meat', 'thick', 'Beef Bowl', 'shiso', 'apple', 'stone', 'sukiyaki', 'region', 'prepare', 'ground', 'flaky', 'pasta', 'Tendon', 'diner', 'dinner', 'crust', 'tteok', 'pop', 'noodle', 'date', 'year-round', 'Korean New Year', 'bed', 'salt', 'section', 'invigorating', 'property', 'bacon', 'batter', 'haddock', 'sweet', 'maillard', 'Sundae Gukbap', 'gourmet', 'hamburger', 'Glass Noodles', 'ease', 'paste', 'chicken', 'cutlet', 'Jjimdak', 'filling', 'samgyeopsal', 'salad', 'Italian', 'Budae Jjigae', 'bone', 'mul', 'pepper', 'herbal', 'versatility', 'infuse', 'the Korean War', 'promote', 'deep', 'fillet', 'Pork Belly Rice Bowl', 'soak', 'saltiness', 'versatile', 'Chicken', 'Gamjajeon', 'table', 'bar', 'coating', 'citrus', 'Braised Fish', 'peanut', 'collagen', 'Bone Soup', 'flounder', 'Rice Rolls', 'blend', 'dangmyeon', 'Spam', 'substance', 'steak', 'intestine', 'Rice Cakes', 'warm', 'anchovy', 'Thai', 'bamboo', 'meatiness', 'tenderness', 'filet', 'bream', 'contrast', 'showcase', 'Kare Raisu', 'summer', 'bite', 'dip', 'Sour Pork', 'shio', 'cornstarch', 'nutmeg', 'rice', 'korea', 'roast', 'eaten']
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
        user.registered_allergy = True
        user.save()
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
    
#food recommendation
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def foodText(request):
    user = request.user
    text = request.data.get('text')
    # goal = UserBodyInfo.objects.get(user_id = user.id).goal
    goal = 0
    calorie_bound = user.calorie_bound
    keywords = extract_keywords(text if isinstance(text,str) else extract_keywords(""))
    keywords = remove_duplicates(keywords)
    keywords = [keyword for keyword in keywords if len(keyword) > 2]
    non_food_keywords_path = os.path.join(os.path.dirname(__file__), "unrelated_words.txt")
    with open(non_food_keywords_path, "r") as file:
        non_food_keywords = set(file.read().splitlines())

    keywords = [word for word in keywords if word not in non_food_keywords]

    non_food_keywords_path = os.path.join(os.path.dirname(__file__), "unrelated_words.txt")
    with open(non_food_keywords_path, "r") as file:
        non_food_keywords = set(file.read().splitlines())

    keywords = [word for word in keywords if word not in non_food_keywords]
    matching_keywords = [keyword for keyword in keyword_list if keyword in text]
    final_keywords = list(set(keywords + matching_keywords))
    
    sentiment_results = aspect_based_sentiment_analysis(text, final_keywords)
    
    positive_word = [food for food, sentiment in sentiment_results.items() if sentiment == 'positive']
    negative_word = [food for food, sentiment in sentiment_results.items() if sentiment == 'negative']
    
    file_path = os.path.join(os.path.dirname(__file__), "updated_food_data.csv")
    updated_food_data_df = pd.read_csv(file_path)
    
    allergy_list = []
    allergy_id_set = UserAllergy.objects.filter(user_id = user.id).values('allergy_id')
    for allergy in allergy_id_set:
        allergy_name = Allergy.objects.filter(id=allergy['allergy_id']).values('name').get()
        allergy_list.append(allergy_name['name'])
    
    updated_food_data_df['positive_food_count'] = updated_food_data_df['keywords'].apply(
        lambda keywords: -2 if any(keyword.strip() in allergy_list for keyword in keywords.split(','))
        else -1 if any(keyword.strip() in negative_word for keyword in keywords.split(','))
        else sum(1 for keyword in keywords.split(',') if keyword.strip() in positive_word)
    )

    sorted_df = updated_food_data_df.sort_values(by='positive_food_count', ascending=False)
    food_list = sorted_df['english_name'].head(10).tolist()
    print(food_list)

    return_list = []
    for food in food_list:
        if calorie_bound > 0:
            if goal == -1:
                if Food.objects.get(name=food).calorie < calorie_bound / 3:
                    return_list.append(food)
            elif goal == 1:
                if Food.objects.get(name=food).calorie > calorie_bound / 3:
                    return_list.append(food)
            else:
                return_list.append(food)
        else:
            return_list.append(food)
            
        if len(return_list) == 5:
            break
    print(return_list)
    return Response({'foods':return_list})

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def fridgeImage(request):
    if request.method == 'GET':
        user_id = request.user.id
        try:
            image = UserFridgeImage.objects.filter(user_id=user_id).values('base64image').get()
        except UserFridgeImage.DoesNotExist:
            return Response({'error':'fridge image does not exist'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'success':True})
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
    

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def selectFood(request):
    if request.method == 'GET':
        user_id = request.user.id
        #food list, date_time list seperately
        try:
            food_list = []
            date_time_list = []
            food_date_time_set = SelectedFood.objects.filter(user_id=user_id).values('food_id', 'date_time')
            for food_date_time in food_date_time_set:
                food = Food.objects.get(id=food_date_time['food_id'])
                food_list.append(food.name)
                date_time_list.append(food_date_time['date_time'])
                #date_time_list.append(timezone.localtime(food_date_time['date_time']))
                
            return Response({'foods':food_list, 'date_times':date_time_list})
            
        except SelectedFood.DoesNotExist:
            return Response({'error':'foods do not exist'}, status=status.HTTP_404_NOT_FOUND)
        
    elif request.method == 'POST':
        user = request.user
        food_name = request.data.get('food')
        try:
            food = Food.objects.get(name=food_name)
            saved_food = SelectedFood.objects.create(user_id = user, food_id = food)
            
            selected_food_count = SelectedFood.objects.filter(user_id=user.id).count()
            if selected_food_count % 15 == 0:
                foodSet15 = SelectedFood.objects.filter(user_id=user.id).order_by('-date_time').values('food_id')[:15]
                calorieSum = 0
                for food in foodSet15:
                    calorieSum += Food.objects.get(id = food['food_id']).calorie
                FiveDayCalorie.objects.create(user_id = user, date=saved_food.date_time, calorie=calorieSum)
                calculate_calorie_bound(user)
                
            return Response({"success":True}, status=status.HTTP_201_CREATED)
        except Food.DoesNotExist:
            return Response({'error':'food is wrong'}, status=status.HTTP_400_BAD_REQUEST)

def calculate_calorie_bound(user):
    calorieCount = FiveDayCalorie.objects.filter(user_id=user.id).count()
    weightCount = UserWeight.objects.filter(user_id=user.id).count()
    if  calorieCount >= 2 and (calorieCount + 1 == weightCount):
        fiveDayCalorieSet = FiveDayCalorie.objects.filter(user_id=user.id).order_by('-date').values('calorie')
        weightSet = UserWeight.objects.filter(user_id=user.id).order_by('-date').values('weight')
        calorieList = []
        for i in range(0, calorieCount - 1):
            calorie1 = fiveDayCalorieSet[i]['calorie']
            calorie2 = fiveDayCalorieSet[i+1]['calorie']
            deltaWeight1 = weightSet[i]['weight'] - weightSet[i+1]['weight']
            deltaWeight2 = weightSet[i+1]['weight'] - weightSet[i+2]['weight']
            deltaCalorie = calorie2 - calorie1
            deltaDeltaWeight = deltaWeight2 - deltaWeight1
            if deltaCalorie * deltaDeltaWeight > 0:
                ans = calorie1 - (deltaCalorie/deltaDeltaWeight) * deltaWeight1
                calorieList.append(ans)
        if len(calorieList) > 0:
            calorie_bound = sum(calorieList)/len(calorieList)
            user.calorie_bound = calorie_bound / 5
            user.save()

def preprocess_text(text):
    lemmatizer = WordNetLemmatizer()
    stop_words = set(stopwords.words("english"))
    tokens = nltk.word_tokenize(text)

    lemmas = []
    for token in tokens:
        if token.lower() not in stop_words and token.isalpha():
            lemma = lemmatizer.lemmatize(token.lower())
            lemmas.append(lemma)
    return lemmas

def get_nouns(tokens):
    pos_tags = pos_tag(tokens)
    nouns = []
    for word, pos in pos_tags:
        if pos.startswith('NN'):
            nouns.append(word)
    return nouns


def get_entities(text):
    doc = nlp(text)
    entities = [ent.text for ent in doc.ents]
    return entities


def extract_keywords(text):
    lemmas = preprocess_text(text)
    nouns = get_nouns(lemmas)
    entities = get_entities(text)
    relevant_keywords = list(set(nouns + entities))
    return relevant_keywords

def remove_duplicates(keywords):
    if isinstance(keywords, list):
        return list(set(keywords))
    return keywords  

def aspect_based_sentiment_analysis(text, aspects):
    model_name = 'yangheng/deberta-v3-large-absa-v1.1'
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSequenceClassification.from_pretrained(model_name)
    sentiment_results = {}

    for aspect in aspects:
        aspect_text = f"{text} [SEP] {aspect}"
        inputs = tokenizer(aspect_text, return_tensors='pt', truncation=True)
        outputs = model(**inputs)
        logits = outputs.logits

        negative_logit = logits[0][0].item()
        positive_logit = logits[0][2].item()

        if positive_logit > negative_logit:
            sentiment = "positive"
        else:
            sentiment = "negative"

        sentiment_results[aspect] = sentiment

    return sentiment_results
