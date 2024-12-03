from django.db import models
from django.utils import timezone
from django.db.models.signals import post_migrate
from django.dispatch import receiver
import os, csv, ast

from account.models import *
# Create your models here.

class Allergy(models.Model):
  name = models.CharField(max_length=30, unique=True)

class UserAllergy(models.Model):
  user_id = models.ForeignKey(User, to_field = 'id', on_delete=models.CASCADE)
  allergy_id = models.ForeignKey(Allergy, to_field = 'id', on_delete=models.CASCADE)
  
  class Meta:
      constraints = [
          models.UniqueConstraint(fields=['user_id', 'allergy_id'], name = 'unique_user_id_allergy_id')
      ]

class Ingredient(models.Model):
  name = models.CharField(max_length=30, unique=True)
  
class Food(models.Model):
  name = models.CharField(max_length=100, unique=True)
  calorie = models.IntegerField(default=0)
  carbohydrate = models.IntegerField(default=0)
  protein = models.IntegerField(default=0)
  fat = models.IntegerField(default=0)
  cuisine = models.CharField(max_length=30, default=' ')
  description = models.TextField(default=' ')
  vegan = models.BooleanField(default=False)

class FoodCharacteristic(models.Model):
  food_id = models.ForeignKey(Food, to_field = 'id', on_delete=models.CASCADE)
  characteristic = models.CharField(max_length=30)
  
  class Meta:
      constraints = [
          models.UniqueConstraint(fields=['food_id', 'characteristic'], name = 'unique_food_id_characteristic')
      ]
      
class FoodCategory(models.Model):
  food_id = models.ForeignKey(Food, to_field = 'id', on_delete=models.CASCADE)
  category = models.CharField(max_length=30)
  
  class Meta:
      constraints = [
          models.UniqueConstraint(fields=['food_id', 'category'], name = 'unique_food_id_category')
      ]
  
class IngredientInFood(models.Model):
  ingredient_id = models.ForeignKey(Ingredient, to_field = 'id', on_delete=models.CASCADE)
  food_id = models.ForeignKey(Food, to_field = 'id', on_delete=models.CASCADE)
  
  class Meta:
      constraints = [
          models.UniqueConstraint(fields=['ingredient_id', 'food_id'], name = 'unique_ingredient_id_food_id')
      ]

class FoodAllergy(models.Model):
  food_id = models.ForeignKey(Food, to_field = 'id', on_delete=models.CASCADE)
  allergy_id = models.ForeignKey(Allergy, to_field = 'id', on_delete=models.CASCADE)
  
  class Meta:
      constraints = [
          models.UniqueConstraint(fields=['food_id', 'allergy_id'], name = 'unique_food_id_allergy_id')
      ]

class FoodKeyword(models.Model):
  food_id = models.ForeignKey(Food, to_field = 'id', on_delete=models.CASCADE)
  keyword = models.CharField(max_length=30)
  
  class Meta:
      constraints = [
          models.UniqueConstraint(fields=['food_id', 'keyword'], name = 'unique_food_id_keyword')
      ]
      
class SelectedFood(models.Model):
  user_id = models.ForeignKey(User, to_field = 'id', on_delete=models.CASCADE)
  date_time = models.DateTimeField(default=timezone.now)
  food_id = models.ForeignKey(Food, to_field = 'id', on_delete=models.CASCADE)
  
  class Meta:
      constraints = [
          models.UniqueConstraint(fields=['user_id', 'date_time'], name = 'unique_user_id_date_time_food')
      ]

class FiveDayCalorie(models.Model):
  user_id = models.ForeignKey(User, to_field = 'id', on_delete=models.CASCADE)
  date = models.DateField(default=timezone.now)
  calorie = models.IntegerField()
  
@receiver(post_migrate)
def add_default_foods(sender, **kwargs):
  if Food.objects.count() == 85:
    return
  else:
    Food.objects.all().delete()
    Ingredient.objects.all().delete()
    Allergy.objects.all().delete()
  
  file_path = os.path.join(os.path.dirname(__file__), 'updated_food_data.csv')
  with open(file_path, mode='r', encoding='utf-8') as file:
    reader = csv.DictReader(file)
    
    dict_ingredient = {}
    dict_allergy = {}
    
    for row in reader:
      english_name = row['english_name']
      Characteristic = set(c.strip() for c in row['Characteristic'].split(','))
      cuisine = row['cuisine']
      category = set(c.strip() for c in row['category'].split(','))
      English_ingredient = set(i.strip() for i in row['English_ingredient'].split(','))
      description = row['description']
      vegetarians = row[' vegetarians']
      allergy = set(a.strip() for a in row['allergy'].split(','))
      keywords = set(ast.literal_eval(row['keywords']))
      
      #create food
      food = Food.objects.create(name=english_name, cuisine=cuisine
                                 , description=description, vegan=vegetarians)
      #characteristic
      for c in Characteristic:
        FoodCharacteristic.objects.create(food_id=food, characteristic=c)
      
      #category
      for c in category:
        FoodCategory.objects.create(food_id=food, category=c)
      
      #ingredient
      for i in English_ingredient:
        if i not in dict_ingredient:
          dict_ingredient[i] = Ingredient.objects.create(name=i)
        IngredientInFood.objects.create(ingredient_id=dict_ingredient[i]
                                        , food_id=food)
      
      #allergy
      for a in allergy:
        if a not in dict_allergy:
          dict_allergy[a] = Allergy.objects.create(name=a)
        FoodAllergy.objects.create(food_id=food
                                   , allergy_id=dict_allergy[a])
      
      #keywords
      for k in keywords:
        FoodKeyword.objects.create(food_id=food, keyword=k)
      
      print(english_name)