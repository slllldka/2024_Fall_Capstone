from django.db import models
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

class Food(models.Model):
  name = models.CharField(max_length=30, unique=True)
  calorie = models.IntegerField()
  carbohydrate = models.IntegerField()
  protein = models.IntegerField()
  fat = models.IntegerField()
  vegan = models.BooleanField(default=False)

class Ingredient(models.Model):
  name = models.CharField(max_length=30, unique=True)

class IngredientInFood(models.Model):
  ingredient_id = models.ForeignKey(Ingredient, to_field = 'id', on_delete=models.CASCADE)
  food_id = models.ForeignKey(Food, to_field = 'id', on_delete=models.CASCADE)
  
  class Meta:
      constraints = [
          models.UniqueConstraint(fields=['ingredient_id', 'food_id'], name = 'unique_ingredient_id_food_id')
      ]

class FoodKeyword(models.Model):
  food_id = models.ForeignKey(Food, to_field = 'id', on_delete=models.CASCADE)
  keyword = models.CharField(max_length=30)
  
  class Meta:
      constraints = [
          models.UniqueConstraint(fields=['food_id', 'keyword'], name = 'unique_food_id_keyword')
      ]