from django.contrib import admin
from .models import *
# Register your models here.

admin.site.register(Allergy)
admin.site.register(UserAllergy)
admin.site.register(Ingredient)
admin.site.register(Food)
admin.site.register(FoodCharacteristic)
admin.site.register(FoodCategory)
admin.site.register(IngredientInFood)
admin.site.register(FoodAllergy)
admin.site.register(FoodKeyword)
admin.site.register(SelectedFood)
admin.site.register(FiveDayCalorie)